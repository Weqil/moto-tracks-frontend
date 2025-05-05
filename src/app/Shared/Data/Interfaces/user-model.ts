import { ICommand } from "./command";

export interface User{
    id: number;
    name: string;
    email: string;
    email_verified_at:string|null,
    avatar:string|null,
    surname?:string,
    city?:string,
    rank?:string,
    access_token?:string,
    user?:any
    start_number?:number|null,
    user_id?:any,
    grade?:{
        name?:string
    }
    personal?:{
        name: string,
        surname:string,
        patronymic:string,
        date_of_birth:string,
        city:string,
        inn:string,
        command_id:string,
        region?:string,
        snils:number,
        phone_number:string,
        start_number:string,
        group:string,
        ranks:string,
        command?:ICommand,
        rank:string,
        rank_number:string,
        community:string,
        location:{
            id:string,
            name:string,
        }
        
        moto_stamp:string,
        engines:string,
        engine:string,
        number_and_seria:string,
        race_class?:string,
        command_name?:string
        
        
    },
    coach?:string,
    community?:string,
    patronymic:string,
    location:{
        id:string,
        name:string,
        type:string,
    },
    date_of_birth:string,
    phone_number:string,
    engine:string,
    number_and_seria:string,
    race_class?:string
    moto_stamp:string,
    inn:string,
    snils:number,


    roles:{
        id:number,
        name:string
    }[],
    phone?:{
        number:string,
        number_verified_at:string,
    }
}
export interface Racer{
    id: number,
    name: string,
    images:string[],
    address:string,
    start_number:number,
    rewards:{name:string,icon:string}[]
}

