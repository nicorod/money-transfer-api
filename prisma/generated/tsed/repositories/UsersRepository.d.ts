import { PrismaService } from "../services/PrismaService";
import { Prisma, users } from "../client";
import { UsersModel } from "../models";
export declare class UsersRepository {
    protected prisma: PrismaService;
    get collection(): Prisma.usersDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;
    get groupBy(): any;
    protected deserialize<T>(obj: null | users | users[]): T;
    findUnique(args: Prisma.usersFindUniqueArgs): Promise<UsersModel | null>;
    findFirst(args: Prisma.usersFindFirstArgs): Promise<UsersModel | null>;
    findMany(args?: Prisma.usersFindManyArgs): Promise<UsersModel[]>;
    create(args: Prisma.usersCreateArgs): Promise<UsersModel>;
    update(args: Prisma.usersUpdateArgs): Promise<UsersModel>;
    upsert(args: Prisma.usersUpsertArgs): Promise<UsersModel>;
    delete(args: Prisma.usersDeleteArgs): Promise<UsersModel>;
    deleteMany(args: Prisma.usersDeleteManyArgs): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany(args: Prisma.usersUpdateManyArgs): Prisma.PrismaPromise<Prisma.BatchPayload>;
    aggregate(args: Prisma.UsersAggregateArgs): Prisma.PrismaPromise<Prisma.GetUsersAggregateType<{
        where?: Prisma.usersWhereInput;
        orderBy?: Prisma.Enumerable<Prisma.usersOrderByWithRelationInput>;
        cursor?: Prisma.usersWhereUniqueInput;
        take?: number;
        skip?: number;
        _count?: true | Prisma.UsersCountAggregateInputType;
        _avg?: Prisma.UsersAvgAggregateInputType;
        _sum?: Prisma.UsersSumAggregateInputType;
        _min?: Prisma.UsersMinAggregateInputType;
        _max?: Prisma.UsersMaxAggregateInputType;
    }>>;
}
