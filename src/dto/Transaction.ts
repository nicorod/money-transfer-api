
interface Transaction {
    id?: number;
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    time?: BigInt;
};

export { Transaction };