
interface Transaction {
    id?: number;
    fromAccountId: number;
    toAccountId: number;
    amount: number;
};

export { Transaction };