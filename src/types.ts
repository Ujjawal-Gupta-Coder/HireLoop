export type Session = {
    user?: {
        name?: string | null,
        email?: string | null,
        image?: string | null
    } | null
} | null

export type Plan = {
    id:string,
    name:string,
    credits:number,
    amount:number,
    currencySymbol:string,
    description:string, 
    features:string[], 
    isMostPopular:boolean, 
    buttonText:string, 
}