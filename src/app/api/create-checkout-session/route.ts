import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { stripe } from "@/src/lib/stripe"

export const POST = async (req: Request) => {
    try {
        const body = await req.json();

        if(!body?.id || typeof body.id !== "string") {
            return Response.json({
                success: false,
                message: "Invalid plan id",
                data: null
            }, {status: 404})
        }

        const authSession = await auth();

        if(!authSession?.user) {
            return Response.json({
                success: false,
                message: "Access denied",
                data: null
            }, {status: 401})
        }

        const planDetails = await prisma.plan.findUnique({
            where: {
                id: body.id
            },
            select: {
                name: true,
                amount: true
            }
        })
        
        if(!planDetails) {
            return Response.json({
                success: false,
                message: "Plan not found",
                data: null
            }, {status: 404})
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: planDetails.name,
                        },
                        unit_amount: planDetails.amount * 100
                    },
                    quantity: 1,
                }   
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        });

        return Response.json({
            success: true,
            message: "checkout session created successfully",
            data: {
                url: session.url
            }
        }, {status: 200})

    } catch(error) {
        console.error("Error in Create checkout session: ", error);
        
        return Response.json({
            success: false,
            message: "Internal server error",
            data: null
        }, {status: 500})
    }
}