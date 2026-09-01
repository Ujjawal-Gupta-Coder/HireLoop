import { auth } from "@/src/auth";
import { calculateInterviewRequirements } from "@/src/helper/helper.server";
import { prisma } from "@/src/lib/prisma";
import { InterviewStatus } from "@prisma/client";

export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        if(!body || !body.type || !body.role || !body.experience || !body.difficulty || !body.skills || !Array.isArray(body.skills) || body.skills.length === 0 || !body.session ) return Response.json({
            success: false,
            message: "Interview configuration is missing",
            data: null
        }, {status: 400});

        const authSession = await auth()
        if(!authSession?.user?.email) return Response.json({
            success: false,
            message: "Access denied",
            data: null
        }, {status: 401});


        const {error, data: sessionData} = calculateInterviewRequirements(body.type, body.session);

        if(error || !sessionData) {
            console.error("Error in calculating required credits or total questions: ", error);
            return Response.json({
                success: false,
                message: error || "Failed to calculate required credits or total questions",
                data: null
            }, {status: 400});
        }
        const {questions: totalQuestions, credits: requiredCredits} = sessionData;

        const user = await prisma.user.findUnique({
            where: {
                email: authSession.user.email
            },
            select: {
                id: true,
                credits: true
            }
        })
        if(!user) {
            return Response.json({
                success: false,
                message: "User does not exist",
                data: null
            }, {status: 401})
        }

        if(!user.credits || user.credits < requiredCredits) {
            return Response.json({
                success: false,
                message: "insufficient credits",
                data: null
            }, {status: 400})
        }

        try {
            const interviewSession = await prisma.$transaction(async (tx) => {

                await tx.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        credits: {
                            decrement: requiredCredits
                        }
                    }
                })

                await tx.creditHistory.create({
                    data: {
                        userId: user.id,
                        credit: -1 * requiredCredits,
                        type: body.type,
                        reason: "Interview session started"
                    }
                })

                return await tx.interviewHistory.create({
                    data: {
                        userId: user.id,
                        type: body.type,
                        role: body.role,
                        experience: body.experience,
                        difficulty: body.difficulty,
                        skills: body.skills,
                        sessionType: body.session,
                        context: body.context,
                        creditsUsed: requiredCredits,
                        totalQuestions,
                        answered: 0, 
                        status: InterviewStatus.RUNNING 
                    }
                })
            })
            
            return Response.json({
                success: true,
                message: "Interview session created successfully",
                data: {interviewId: interviewSession.id}
            }, {status: 200});

        } catch(error) {
            console.error("Error in prisma db transaction for interview creation: ", error);
            return Response.json({
                success: false,
                message: "Database operation failed",
                data: null
            }, {status: 500});
        }

    } catch(error) {
        console.error("Error in creating interview: ", error);
        return Response.json({
            success: false,
            message: "Internal server error",
            data: null
        }, {status: 500});
    }
}