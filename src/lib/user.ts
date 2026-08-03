import { CreditTransactionType } from "@prisma/client";
import { isValidEmail } from "../helper/helper.common";
import { prisma } from "./prisma";

export const createUserIfNotExists = async (name:string, email:string) => {
    try {
        const userName = name.trim();
        const userEmail = email.trim();

        if(!userName || !userEmail) return false;

        if(!isValidEmail(userEmail)) return false;

        const userExist = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        })

        if(userExist) return userExist;

        await prisma.$transaction(async (tx) => {
            const userCreated = await tx.user.create({
                data: {
                    name: userName,
                    email: userEmail,
                    credits: 50
                }
            })

            await tx.creditHistory.create({
                data: {
                    userId: userCreated.id,
                    credit: 50,
                    type: CreditTransactionType.REGISTRATION,
                    reason: "Welcome Bonus"
                }
            })

            console.log(`User created successfully with id ${userCreated.id}`);
            return userCreated;
        })
    
    } catch(error) {
        console.error("Error in creating a new user", error)
        return false;
    }  
}
 