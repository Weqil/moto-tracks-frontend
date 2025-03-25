export interface ICommand {
    id: number,
    name: string,
    full_name?: string
    location?:{
        id:number,
        name:string,
        type:string
    }
    avatar?:string,
    city:string
    
    
}

export interface ICommandCreate {
    id:number,
    name: string,
    fullName?: string,
    locationId:number,
    avatar?:string,
    city:string,
    coach?:string
    region:string
}