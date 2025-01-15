import { User } from "./user-model";

export interface Login {
    status: string;
    message: string;
    access_token: string|null;
    token_type:string,
    user: User
}