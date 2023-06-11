import { accounts } from "../client";
import { AccountType } from "../enums";
import { UsersModel } from "./UsersModel";
import { TransactionsModel } from "./TransactionsModel";
export declare class AccountsModel implements accounts {
    id: number;
    balance: number;
    isActive: boolean;
    type: AccountType;
    user: UsersModel;
    userId: number;
    transactionsFrom: TransactionsModel[];
    transactionsTo: TransactionsModel[];
}
