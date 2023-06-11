import { PrismaService } from "../services/PrismaService";
import { Prisma, transactions } from "../client";
import { TransactionsModel } from "../models";
export declare class TransactionsRepository {
    protected prisma: PrismaService;
    get collection(): Prisma.transactionsDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;
    get groupBy(): any;
    protected deserialize<T>(obj: null | transactions | transactions[]): T;
    findUnique(args: Prisma.transactionsFindUniqueArgs): Promise<TransactionsModel | null>;
    findFirst(args: Prisma.transactionsFindFirstArgs): Promise<TransactionsModel | null>;
    findMany(args?: Prisma.transactionsFindManyArgs): Promise<TransactionsModel[]>;
    create(args: Prisma.transactionsCreateArgs): Promise<TransactionsModel>;
    update(args: Prisma.transactionsUpdateArgs): Promise<TransactionsModel>;
    upsert(args: Prisma.transactionsUpsertArgs): Promise<TransactionsModel>;
    delete(args: Prisma.transactionsDeleteArgs): Promise<TransactionsModel>;
    deleteMany(args: Prisma.transactionsDeleteManyArgs): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany(args: Prisma.transactionsUpdateManyArgs): Prisma.PrismaPromise<Prisma.BatchPayload>;
    aggregate(args: Prisma.TransactionsAggregateArgs): Prisma.PrismaPromise<Prisma.GetTransactionsAggregateType<{
        where?: Prisma.transactionsWhereInput;
        orderBy?: Prisma.Enumerable<Prisma.transactionsOrderByWithRelationInput>;
        cursor?: Prisma.transactionsWhereUniqueInput;
        take?: number;
        skip?: number;
        _count?: true | Prisma.TransactionsCountAggregateInputType;
        _avg?: Prisma.TransactionsAvgAggregateInputType;
        _sum?: Prisma.TransactionsSumAggregateInputType;
        _min?: Prisma.TransactionsMinAggregateInputType;
        _max?: Prisma.TransactionsMaxAggregateInputType;
    }>>;
}
