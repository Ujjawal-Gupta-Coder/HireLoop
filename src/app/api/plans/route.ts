import { prisma } from "@/src/lib/prisma"

export const GET = async () => {
    try {
        const plans = await prisma.plan.findMany({
            select: {
                id:true,
                name:true,
                credits:true,
                amount:true,
                currencySymbol:true,
                description:true, 
                features:true, 
                isMostPopular:true, 
                buttonText:true, 
            },
            orderBy: {
                amount: "asc"
            }
        });

        return Response.json({
            success: true,
            message: "Plans details fetched successfully",
            data: plans
        }, {status: 200})

    } catch(error) {
        console.error("Error in fetching plan details", error);

        return Response.json({
            success: false,
            message: "Internal server error",
            data: null
        }, {status: 500})
    }
    
}