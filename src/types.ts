export type Session = {
    user: {
        name: string,
        email: string
    }
}

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