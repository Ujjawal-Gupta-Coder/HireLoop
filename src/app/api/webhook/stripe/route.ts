import { prisma } from "@/src/lib/prisma";
import { stripe } from "@/src/lib/stripe";
import { CreditTransactionType, Prisma, User } from "@prisma/client";
import { generatePaymentReceiptPDF } from "@/src/helper/helper.common";
import path from "path";
import fs from "fs";
import Stripe from "stripe";

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

    let user: User | {name:string, email:string} = {name:"Invalid", email:""};
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

            await tx.creditHistory.create({
                data: {
                    userId,
                    credit: planDetails.credits,
                    type: CreditTransactionType.PURCHASE,
                    stripeSessionId: session.id,
                    reason: `${planDetails.name} Plan Purchased`
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

    const receiptID = `HLP-${Date.now()}`;

    const receiptPDFBytes = await generatePaymentReceiptPDF({
        customerName:  user.name,
        customerEmail: user.email,
        receiptID,
        date: session.created,
        paymentMethod: "Stripe Checkout",
        planName: planDetails.name,
        credits: planDetails.credits,
        amount: session.amount_total ?  session.amount_total/100 : 0,
    });

    const filePath = path.join(process.cwd(), "receipt.pdf");
    fs.writeFileSync(filePath, receiptPDFBytes);

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