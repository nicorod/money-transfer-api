import { users } from "../client";
import { Role } from "../enums";
import { AccountsModel } from "./AccountsModel";
export declare class UsersModel implements users {
    id: number;
    name: string;
    role: Role;
    accounts: AccountsModel[];
}
