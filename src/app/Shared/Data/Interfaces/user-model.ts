export interface User{
    id: number;
    name: string;
    email: string;
    email_verified_at:string|null,
    avatar:string|null,
    personal:{
        name: string,
        surname:string,
        patronymic:string,
        date_of_birth:string,
        city:string,
        inn:string,
        snils:number,
        phone_number:string,
        start_number:string,
        group:string,
        ranks:string,
        rank:string,
        rank_number:string,
        community:string,
        coach:string,
        moto_stamp:string,
        engines:string              
    },
    roles:{
        id:number,
        name:string
    }[]
}
export interface Racer{
    id: number,
    name: string,
    images:string[],
    address:string,
    start_number:number,
    rewards:{name:string,icon:string}[]
}

