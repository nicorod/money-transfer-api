import { Pool, QueryResult } from 'pg';
import { UserRole } from '../../dto/User';
import { UsersRepository } from './UsersRepository';

describe('UserRepository', () => {
  let userRepository: UsersRepository;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    mockPool = ({
      connect: jest.fn(),
      query: jest.fn(),
      release: jest.fn(),
    } as unknown) as jest.Mocked<Pool>;

    userRepository = new UsersRepository(mockPool);
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

      const users = await userRepository.getAllUsers();

      expect(users).toEqual([
        { id: 1, name: 'John Doe', role: 'USER' },
        { id: 2, name: 'Jane Smith', role: 'ADMIN' },
      ]);

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users');
    });

    it('should return the user with id passed in params', async () => {
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

      const user = await userRepository.getUser(1);

      expect(user).toEqual({ id: 1, name: 'John Doe', role: 'USER' });
      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users where id = $1', [1]);
    });

    it('should handle an error and throw if the database query fails', async () => {
      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();
      (mockPool as any).query.mockRejectedValueOnce(new Error('Database query error'));

      await expect(userRepository.getAllUsers()).rejects.toThrow('Database query error');
      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users');
      expect((mockPool as any).release).toHaveBeenCalledTimes(1);
    });

    it('should execute the query with the correct SQL and parameters', async () => {
      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();
  
      const user = { id: 1, name: 'John Doe', role: UserRole.ADMIN };
  
      await userRepository.saveUser(user);
  
      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO users (name, role) VALUES ($1, $2);',
        [user.name, user.role]);
    });

    it('should delete the user with id passed in params', async () => {
      
      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();

      const user = await userRepository.deleteUser(1);

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM users where id = $1', [1]);
    });

    it('should update the user with id passed in params', async () => {
      
      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();
      const userUpdated = { id: 1, name: 'John Doe', role: UserRole.ADMIN };

      const user = await userRepository.updateUser(1, userUpdated);

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith('UPDATE users SET name = $2, role = $3 WHERE id = $1;', [1, userUpdated.name, userUpdated.role]);
    });
  });

});
