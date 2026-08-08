import { auth } from "@/src/auth";
import { generateSignedURL } from "@/src/helper/helper.server";
import { prisma } from "@/src/lib/prisma";

type context = {
    params: Promise<{ paymentId: string }>
}

export const GET = async (_:Request, context: context) => {
    try {
        const session =  await auth();
        if(!session?.user?.email) return Response.json({
            success: false,
            message: "unauthenticated Access",
            data: null
        }, {status: 401})

        const {paymentId: rawId} = await context.params;
        const receiptId = rawId.trim() 

        if(!receiptId) return Response.json({
            success: false,
            message: "Missing Receipt ID",
            data: null
        }, {status: 400})

        const payment = await prisma.payment.findUnique({
            where: {
                receiptId,
                user: {
                    email: session.user.email
                }
            },
            select: {
                receiptId: true,
                receiptPath: true
            }
        })
        if(!payment) return Response.json({
            success: false,
            message: "Payment details not found",
            data: null
        }, {status: 404})

        if(!payment.receiptPath) return Response.json({
            success: true,
            message: "Receipt not Available",
            data: null
        }, {status: 200}) 

        try {
            const url = await generateSignedURL(payment.receiptPath);
            return Response.json({
                success: true,
                message: "Receipt URL generated successfully",
                data: { url }
            }, {status: 200})
                
        } catch(error) {
            console.error("Generate Signed URL Failed: ", error);
            
            return Response.json({
                success: false,
                message: "Failed to generate receipt URL",
                data: null
            }, {status: 500})
        }
    }
    catch(error) {
        console.error("Internal server error: ", error);
        return Response.json({
            success: false,
            message: "Internal server error",
            data: null
        }, {status: 500})
    }   
}