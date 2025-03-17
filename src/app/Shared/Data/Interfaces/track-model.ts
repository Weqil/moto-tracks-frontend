

export interface Track {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    logo?: string|null;
    is_work?:boolean;
    location:{
        id:number,
        name:string,
        type:string
    }
    free?:string;
    length?:number
    turns?:number
    desc?: string,
    level: {name:string, color:string}
    spec?:[{title:string, value:string}],
    contacts?:[{title:string, value:string}],
    images?:any;
    additionalServices?:any;
    date_start?:string;
    schema_img?:string;
    light?:boolean;
    season?:boolean;
    

}