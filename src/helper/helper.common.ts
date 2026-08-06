export const isValidEmail = (email : string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email); 
}

export const generateInitials = (username : string) => {
    const trim = username.trim();

    if(!trim || trim.toLowerCase() == "invalid") return "?";

    const split = trim.split(" ");
    const len = split.length;

    if(len == 1) return split[0][0].toUpperCase();

    return split[0][0].toUpperCase()+split[len-1][0].toUpperCase();

}
