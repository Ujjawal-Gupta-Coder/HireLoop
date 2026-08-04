import { prisma } from "@/src/lib/prisma";
import { stripe } from "@/src/lib/stripe";
import { CreditTransactionType, Payment, PaymentStatus, Prisma, User } from "@prisma/client";
import { generatePaymentReceiptPDF } from "@/src/helper/helper.common";
import Stripe from "stripe";
import { supabase } from "@/src/lib/supabase";

const handlePaymentSuccessCase = async (event: Stripe.CheckoutSessionCompletedEvent) => { 

    const session = event.data.object;

    const userId = session?.metadata?.userId;
    const planId = session?.metadata?.planId;

    if(!userId || !planId) {
        return Response.json({
            success: false,
            message: "Missing metadata",
            data: null
        }, {status: 400})
    }

    const planDetails = await prisma.plan.findUnique(
    {
        where: {
            id: planId
        }
    })

    if(!planDetails) {

        return Response.json({
            success: false,
            message: "Webhook acknowledged. Plan not found",
            data: null
        }, {status: 200})
    }

    const receiptID = `HLP-${session.created}-${session.id.slice(-6).toUpperCase()}`;

    let user: User | null = null;
    let payment: Payment | null = null;
    try {
        await prisma.$transaction(async(tx) => {

            user = await tx.user.update({
                where: {
                    id: userId
                },
                data: {
                    credits: {
                        increment: planDetails.credits
                    }
                }
            })

            const creditHistory = await tx.creditHistory.create({
                data: {
                    userId,
                    credit: planDetails.credits,
                    type: CreditTransactionType.PURCHASE,
                    stripeSessionId: session.id,
                    reason: `${planDetails.name} Plan Purchased`
                }
            })

            payment = await tx.payment.create({
                data: {
                    userId: user!.id,
                    planId: planDetails.id,
                    creditHistoryId: creditHistory!.id,
                    amount: session.amount_total ?  session.amount_total/100 : 0,
                    currencyCode: session.currency?.toUpperCase() || "INR",
                    status: PaymentStatus.PAID,
                    sessionId: session.id,
                    receiptId: receiptID,
                }
            })
        })

    } catch(error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
                 console.log("Webhook already processed")
                return Response.json({
                    success: true,
                    message: "Webhook already processed",
                    data: null
                }, {status: 200})
            }

        console.error("Error in database processing", error);

        return Response.json({
            success: false,
            message: "Internal server error",
            data: null
        }, {status: 500})
    }

    let receiptPath:string;
    try {
        const receiptPDFBytes = await generatePaymentReceiptPDF({
            customerName:  user!.name,
            customerEmail: user!.email,
            receiptID,
            date: session.created,
            paymentMethod: "Stripe Checkout",
            planName: planDetails.name,
            credits: planDetails.credits,
            amount: session.amount_total ?  session.amount_total/100 : 0,
        });

        const filePath = `${userId}/${session.id}.pdf`;
    
        const {data, error} = await supabase.storage.from("Receipts")
            .upload(filePath, receiptPDFBytes, {
                contentType: "application/pdf",
                upsert: false                                   // override file : No, same name file throw error
            })
        if(error) throw new Error(`Receipt upload failed: ${error.message}`)
        
        receiptPath = data.path;

    } catch (error) {
        console.error("Receipt generation/upload failed: ", error);
        return Response.json({
            success: true,
            message: "Webhook Processed, Receipt generation/upload failed",
            data: null
        }, {status: 200})
    }

    try {
        await prisma.payment.update({
            where: {
                id: payment!.id
            },
            data: {
                receiptPath,
            }
        })
    } catch(error) {
        console.error("error in updating payment receipt path: ", error);
        await supabase.storage.from("Receipts").remove([receiptPath]);
        return Response.json({
            success: true,
            message: "Webhook processed, payment receiptPath failed",
            data: null
        }, {status: 200})
    }
    

    return Response.json({
        success: true,
        message: "Webhook processed successfully",
        data: null
    }, {status: 200})
}

export const POST = async (req:Request) => {
    try {
        
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if(!signature) {
            return Response.json({
                success: false,
                message: "Missing stripe signature",
                data: null
            }, {status: 400})
        }

        let event: Stripe.Event 
        try {
            event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

        } catch(error) {
            console.error("Signature verification failed", error);

            return Response.json({
                success: false,
                message: "Signature verification failed",
                data: null
            }, {status: 400})
        }

        switch(event.type) {
            case "checkout.session.completed":
                return await handlePaymentSuccessCase(event);
            default: 
                console.log("Event ignored")

                return Response.json({
                    success: true,
                    message: "Event ignored",
                    data: null
                }, {status: 200})
        }

        
    } catch(error) {
        console.error("Error in stripe webhook processing", error);

        return Response.json({
            success: false,
            message: "Webhook processing failed",
            data: null
        }, {status: 500})
    }

} 