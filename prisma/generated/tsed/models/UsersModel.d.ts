import { users } from "../client";
import { Role } from "../enums";
import { AccountsModel } from "./AccountsModel";
export declare class UsersModel implements users {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;
    accounts: AccountsModel[];
}
