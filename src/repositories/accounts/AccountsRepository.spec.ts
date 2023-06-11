import { Pool, QueryResult } from 'pg';
import { AccountType } from '../../dto/Account';
import { AccountsRepository } from './AccountsRepository';

describe('AccountsRepository', () => {
  let mockPool: jest.Mocked<Pool>;
  let accountsRepository: AccountsRepository;

  beforeEach(() => {
    mockPool = ({
      connect: jest.fn(),
      query: jest.fn(),
      release: jest.fn(),
    } as unknown) as jest.Mocked<Pool>;
    accountsRepository = new AccountsRepository(mockPool);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccounts', () => {
    it('should return accounts for a given user', async () => {
      const userId = 1;
      const mockQueryResult: QueryResult = {
        rows: [
          { id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive: true },
          { id: 2, accountType: AccountType.CURRENT, balance: 500, userId: 1, isActive: true },
        ],
        rowCount: 2,
        command: '',
        oid: 0,
        fields: [],
      };

      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();
      (mockPool as any).query.mockResolvedValueOnce(mockQueryResult);

      const accounts = await accountsRepository.getAccounts(userId);

      expect(accounts).toEqual([
        { id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive: true },
        { id: 2, accountType: AccountType.CURRENT, balance: 500, userId: 1, isActive: true },
      ]);

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.connect).toHaveBeenCalledWith();

      expect(mockPool.query).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM accounts WHERE "userId" = $1 AND "isActive" = true', [userId]);

    });
  });

  describe('getAccount', () => {
    it('should return an account for a given account ID', async () => {
      const accountId = 1;
      const mockQueryResult: QueryResult = {
        rows: [{ id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive: true}],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: [],
      };

      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();
      (mockPool as any).query.mockResolvedValueOnce(mockQueryResult);

      const account = await accountsRepository.getAccount(accountId);

      expect(account).toEqual({ id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive: true });

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.connect).toHaveBeenCalledWith();

      expect(mockPool.query).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM accounts WHERE id = $1 AND "isActive" = true', [accountId]);
    });

    it('should return undefined if no account is found for a given account ID', async () => {
      const accountId = 1;
      const mockQueryResult: QueryResult = {
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: [],
      };

      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();
      (mockPool as any).query.mockResolvedValueOnce(mockQueryResult);

      const account = await accountsRepository.getAccount(accountId);

      expect(account).toBeUndefined();

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.connect).toHaveBeenCalledWith();

      expect(mockPool.query).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM accounts WHERE id = $1 AND "isActive" = true', [accountId]);
    });
  });

  describe('saveAccount', () => {
    it('should save an account', async () => {
      const account = { id: 1, accountType: AccountType.BASIC_SAVINGS, balance: 1000, userId: 1, isActive: true };

      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();

      await accountsRepository.saveAccount(account);

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.connect).toHaveBeenCalledWith();

      expect(mockPool.query).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO accounts (balance, type, "userId") VALUES ($1, $2, $3)',
        [account.balance, account.accountType, account.userId]
      );
    });
  });

  describe('deleteAccount', () => {
    it('should delete an account', async () => {
      const accountId = 1;

      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();

      await accountsRepository.closeAccount(accountId);

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.connect).toHaveBeenCalledWith();

      expect(mockPool.query).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('UPDATE accounts SET \"isActive\" = false WHERE id = $1', [accountId]);

    });
  });

  describe('modifyAccount', () => {
    it('should delete an account', async () => {
      const account = { id: 1, accountType: AccountType.BASIC_SAVINGS, balance: 1000, userId: 1, isActive: true };

      
      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();

      await accountsRepository.modifyAccount(account);

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.connect).toHaveBeenCalledWith();

      expect(mockPool.query).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('UPDATE accounts SET balance = $1, type = $2 WHERE id = $3', [account.balance, account.accountType, account.userId]);

    });
  });
});
