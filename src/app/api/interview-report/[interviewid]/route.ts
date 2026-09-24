import { auth } from "@/src/auth";
import { generateSignedURL } from "@/src/helper/helper.server";
import { prisma } from "@/src/lib/prisma";

type context = {
    params: Promise<{ interviewid: string }>
}

export const GET = async (_:Request, context: context) => {
    try {
        const session =  await auth();
        if(!session?.user?.email) return Response.json({
            success: false,
            message: "unauthenticated Access",
            data: null
        }, {status: 401})

        const {interviewid: rawId} = await context.params;
        const trimmedInterviewId = rawId.trim();
        if(!trimmedInterviewId) return Response.json({
            success: false,
            message: "Missing Interview ID",
            data: null
        }, {status: 400})

        const interviewReport = await prisma.interviewReport.findUnique({
            where: {
                interviewId: trimmedInterviewId,
            },
            select: {
                reportPath: true
            }
        })
        if(!interviewReport) return Response.json({
            success: false,
            message: "Interview Report not found",
            data: null
        }, {status: 404})

        if(!interviewReport.reportPath) return Response.json({
            success: true,
            message: "Interview report PDF not Available",
            data: null
        }, {status: 200}) 

        try {
            const url = await generateSignedURL("Reports", interviewReport.reportPath);
            return Response.json({
                success: true,
                message: "Interview Report URL generated successfully",
                data: { url }
            }, {status: 200})
                
        } catch(error) {
            console.error("Generate Signed URL Failed: ", error);
            
            return Response.json({
                success: false,
                message: "Failed to generate interview report URL",
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