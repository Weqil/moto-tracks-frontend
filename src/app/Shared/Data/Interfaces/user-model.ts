export interface User{
    id: number;
    name: string;
    email: string;
    email_verified_at:string|null,
    avatar:string|null,
    personalInfo:{
        name: string,
        surname:string,
        patronymic:string,
        dateOfBirth:string,
        city:string,
        inn:string,
        snils:number,
        phoneNumber:string,
        startNumber:string,
        group:string,
        ranks:string,
        rankNumber:string,
        community:string,
        coach:string,
        motoStamp:string,
        engines:string              
    }
}