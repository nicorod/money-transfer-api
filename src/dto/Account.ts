import { User } from "./User";

enum AccountType {
    SAVINGS = 'SAVINGS',
    CURRENT = 'CURRENT',
    BASIC_SAVINGS = 'BASIC_SAVINGS'
}

interface Account {
    id: number;
    accountType: AccountType;
    balance: number;
    userId: number;
    isActive: boolean;
}

export { Account, AccountType };