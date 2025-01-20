export interface Track {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    avatar?: string|null;
    status?:string
    trackParams?:any
}