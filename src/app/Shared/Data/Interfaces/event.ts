import { Track } from "./track-model";

export interface IEvent {
    id: number;
    name: string;
    is_work?:boolean;
    desc?: string,
    date_start?: string,
    track:Track
    images?: string[],
    appointments_exists?:boolean
}