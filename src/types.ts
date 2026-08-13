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

export type InterviewTypeConfig = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  cost: number;
  badge: string;
  iconColor: string;
  borderColor: string;
  glowColor: string;
};

export type InterViewLengthOptionsType = {
    id: string,
    title: string,
    shortTitle: string,
    questions: number,
    duration: string,
    icon: React.ComponentType<{ className?: string }>,
    tagLine: string,
    credits: number,
    isRecommended: boolean,
}