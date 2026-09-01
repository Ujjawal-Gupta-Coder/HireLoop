import { supabase } from "../lib/supabase";

export const generateSignedURL = async (receiptPath: string) => {
    const {data, error} = await supabase.storage.from("Receipts").createSignedUrl(receiptPath, 60);

    if(error) throw new Error(`Generate signed URL failed ${error.message}`)

    return data.signedUrl;
} 

const typeCreditsMapping: Record<string,number> = {
    TECHNICAL_INTERVIEW: 10,
    CODING_INTERVIEW: 15,
    BEHAVIORAL_INTERVIEW: 10,
    SYSTEM_DESIGN_INTERVIEW: 15,
    MIXED_INTERVIEW: 15
}
const sessionTypeMapping: Record<string,Record<string, number>> = {
    QUICK: {
        questions: 5,
        credits: 5
    },
    STANDARD: {
        questions: 8,
        credits: 10
    },
    EXTENDED: {
        questions: 12,
        credits: 15
    },
}

export const calculateInterviewRequirements = (interviewTypeId:string, sessionTypeId:string)  => {
    if(!interviewTypeId || !sessionTypeId) return {
        error: "Missing interview type or session type",
        data: null
    }

    const typeCredits = typeCreditsMapping[interviewTypeId];
    const sessionCredits = sessionTypeMapping[sessionTypeId]?.credits;
    const sessionQuestions = sessionTypeMapping[sessionTypeId]?.questions;

    if(typeCredits === undefined || sessionCredits === undefined || sessionQuestions === undefined) return {
        error: "Invalid interview type or session type",
        data: null
    }

    return {
        error: null,
        data: {
            questions: sessionQuestions,
            credits: typeCredits + sessionCredits
        } 
    } 
}
