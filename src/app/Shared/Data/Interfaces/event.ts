import { Track } from "./track-model";

export interface IEvent {
    id: number;
    name: string;
    is_work?:boolean;
    attendance_with_status_exists?:boolean;
    attendance_without_status_exists?:boolean;
    desc?: string,
    position_file?: string,
    commissions:any,
    results_file?: string,
    date_start?: string,
    commissions_exists?:boolean,
    record_start?:string,
    pdf_files:string[],
    store?:{
        id:number,
        email:string,
        inn:string,
        name:string,
        offer_file:string,
        phone:number,
        politic:string,

    },
    record_end?:string,
    location:{
        name:string,
        type:string
    }
    track:Track,
    grades: any[],
    status?:{id:number,name:string,}
    images?: string[],
    appointments_exists?:boolean
    appointment_count?:{count:number}
    // location?:{name: string}
    
}

// email
// : 
// "bolshe.kivi@gmail.com"
// id
// : 
// 2
// inn
// : 
// "6667776767"
// name
// : 
// "Магазин Баженово"
// offer_file
// : 
// "store/K6bwFeIograR748t16oNyPT06dox9efljwbQI2il.pdf"
// phone
// : 
// "88005553535"
// politic
// : 
// "прочие расходы"