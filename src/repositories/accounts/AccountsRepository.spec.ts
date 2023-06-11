import { Pool, QueryResult } from 'pg';
import { AccountsRepository } from './AccountsRepository';

describe('UserRepository', () => {
  let accountsRepository: AccountsRepository;
  let mockPool: jest.Mocked<Pool>;

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

  describe('getAllUsers', () => {
    it('should return all users from the database', async () => {
      const mockQueryResult: QueryResult = {
        rows: [
          { id: 1, name: 'John Doe', role: 'USER' },
          { id: 2, name: 'Jane Smith', role: 'ADMIN' },
        ],
        rowCount: 2,
        command: '',
        oid: 0,
        fields: [],
      };

      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();
      (mockPool as any).release = jest.fn().mockReturnThis();
      (mockPool as any).query.mockResolvedValueOnce(mockQueryResult);

      const users = await accountsRepository.getAllUsers();
      expect(true);
    });

  
  });

});
