import { Transaction } from "./Transaction";

enum AccountType {
    SAVINGS = 'SAVINGS',
    CURRENT = 'CURRENT',
    BASIC_SAVINGS = 'BASIC_SAVINGS'
}

interface AccountStatement {
    account: Account;
    transactions: Transaction[],
    interestEarned: number,
}

interface Account {
    id: number;
    accountType: AccountType;
    balance: number;
    userId: number;
    isActive: boolean;
}

export { Account, AccountType, AccountStatement };