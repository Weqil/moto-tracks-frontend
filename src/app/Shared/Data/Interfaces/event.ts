import { Track } from "./track-model";

export interface IEvent {
    id: number;
    name: string;
    is_work?:boolean;
    attendance_exists?:boolean;
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