import { transactions } from "../client";
import { AccountsModel } from "./AccountsModel";
export declare class TransactionsModel implements transactions {
    id: number;
    fromAccount: AccountsModel;
    fromAccountId: number;
    toAccount: AccountsModel;
    toAccountId: number;
    amount: number;
    time: bigint;
}
