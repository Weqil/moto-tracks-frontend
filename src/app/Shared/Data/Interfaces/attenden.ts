import { Track } from "./track-model";

export interface IAttenden {
    id:number,
    name: string,
    desc?: string,
    price: number,
    track?: Track
}