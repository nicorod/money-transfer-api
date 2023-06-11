import { PrismaService } from "../services/PrismaService";
import { Prisma, accounts } from "../client";
import { AccountsModel } from "../models";
export declare class AccountsRepository {
    protected prisma: PrismaService;
    get collection(): Prisma.accountsDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;
    get groupBy(): any;
    protected deserialize<T>(obj: null | accounts | accounts[]): T;
    findUnique(args: Prisma.accountsFindUniqueArgs): Promise<AccountsModel | null>;
    findFirst(args: Prisma.accountsFindFirstArgs): Promise<AccountsModel | null>;
    findMany(args?: Prisma.accountsFindManyArgs): Promise<AccountsModel[]>;
    create(args: Prisma.accountsCreateArgs): Promise<AccountsModel>;
    update(args: Prisma.accountsUpdateArgs): Promise<AccountsModel>;
    upsert(args: Prisma.accountsUpsertArgs): Promise<AccountsModel>;
    delete(args: Prisma.accountsDeleteArgs): Promise<AccountsModel>;
    deleteMany(args: Prisma.accountsDeleteManyArgs): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany(args: Prisma.accountsUpdateManyArgs): Prisma.PrismaPromise<Prisma.BatchPayload>;
    aggregate(args: Prisma.AccountsAggregateArgs): Prisma.PrismaPromise<Prisma.GetAccountsAggregateType<{
        where?: Prisma.accountsWhereInput;
        orderBy?: Prisma.Enumerable<Prisma.accountsOrderByWithRelationInput>;
        cursor?: Prisma.accountsWhereUniqueInput;
        take?: number;
        skip?: number;
        _count?: true | Prisma.AccountsCountAggregateInputType;
        _avg?: Prisma.AccountsAvgAggregateInputType;
        _sum?: Prisma.AccountsSumAggregateInputType;
        _min?: Prisma.AccountsMinAggregateInputType;
        _max?: Prisma.AccountsMaxAggregateInputType;
    }>>;
}
