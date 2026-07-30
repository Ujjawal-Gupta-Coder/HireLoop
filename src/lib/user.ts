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

        const userCreated = await prisma.user.create({
            data: {
                name: userName,
                email: userEmail,
                credits: 50
            }
        })

        console.log(`User created successfully with id ${userCreated.id}`);
        return userCreated;

    } catch(error) {
        console.error("Error in creating a new user", error)
        return false;
    }  
}
 