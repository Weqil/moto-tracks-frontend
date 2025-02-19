

export interface Track {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    avatar?: string|null;
    is_work?:boolean;
    location:{
        id:number,
        name:string,
        type:string
    }
    free?:boolean;
    length?:number
    turns?:number
    desc?: string,
    level: {name:string, color:string}
    spec?:[{title:string, value:string}],
    images?:any;
    additionalServices?:any;
    date_start?:string;

}