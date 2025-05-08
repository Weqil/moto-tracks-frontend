import { User } from './user-model';
import { IAttenden } from './attenden';


export interface ITransaction {
    id: number,
    status?: boolean,
    desc?: string,
    count?: number,
    date: Date,
    user: User,
    attendances: IAttenden[]
}