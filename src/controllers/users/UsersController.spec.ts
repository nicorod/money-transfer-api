import { PlatformTest } from '@tsed/common';
import { UsersController } from './UsersController';
import { UsersRepository } from '../../repositories/users/UsersRepository';
import { User, UserRole } from '../../dto/User';
import { NotFound } from '@tsed/exceptions';
import { Pool } from 'pg';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersRepository: UsersRepository;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(async () => {
    await PlatformTest.create();
    mockPool = ({
      connect: jest.fn(),
      query: jest.fn(),
      release: jest.fn(),
    } as unknown) as jest.Mocked<Pool>;
    
    usersRepository = new UsersRepository(mockPool);
    usersController = new UsersController(usersRepository);
  });

  afterEach(async () => {
    await PlatformTest.reset();
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      jest.spyOn(usersRepository, 'getAllUsers').mockResolvedValueOnce([
        { id: 1, name: 'John Doe', role: UserRole.USER, email: "testEmail", password: "password" },
        { id: 2, name: 'Jane Smith', role: UserRole.ADMIN, email: "testEmail", password: "password"  },
      ]);

      const result = await usersController.getUsers();

      expect(result).toEqual([
        { id: 1, name: 'John Doe', role: 'USER', email: "testEmail", password: "password" },
        { id: 2, name: 'Jane Smith', role: 'ADMIN', email: "testEmail", password: "password" },
      ]);
    });
  });

  describe('GET /users/:userId', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce({ id: 1, name: 'John Doe', role: UserRole.USER, email: "testEmail", password: "password" });

      const result = await usersController.getUser(1);

      expect(result).toEqual({ id: 1, name: 'John Doe', role: 'USER', email: "testEmail", password: "password" });
    });

    it('should return null for non-existent user', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce(null as unknown as User);

      const result = await usersController.getUser(1);

      expect(result).toBeNull();
    });
  });

  describe('PUT /users/:userId', () => {
    it('should update an existing user', async () => {
      const userId = 1;
      const user: User = { id: userId, name: 'John Doe', role: UserRole.USER, email: "testEmail", password: "password" };
      const updatedUser: User = { id: userId, name: 'John Smith', role: UserRole.ADMIN, email: "testEmail", password: "password" };

      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce(user);
      jest.spyOn(usersRepository, 'updateUser').mockResolvedValueOnce();

      await expect(usersController.put(userId, updatedUser)).resolves.toBeUndefined();

      expect(usersRepository.getUser).toHaveBeenCalledWith(userId);
      expect(usersRepository.updateUser).toHaveBeenCalledWith(userId, updatedUser);
    });
    it('should throw NotFound error for non-existent user', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce(null as unknown as User);

      await expect(usersController.put(1, { id: 1, name: 'John Smith', role: UserRole.ADMIN, email: "testEmail", password: "password" })).rejects.toThrow(NotFound);

      expect(usersRepository.getUser).toHaveBeenCalledWith(1);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete an existing user', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce({ id: 1, name: 'John Doe', role: UserRole.USER, email: "testEmail", password: "password" });
      jest.spyOn(usersRepository, 'deleteUser').mockResolvedValueOnce();

      await expect(usersController.delete(1)).resolves.toBeUndefined();

      expect(usersRepository.getUser).toHaveBeenCalledWith(1);
      expect(usersRepository.deleteUser).toHaveBeenCalledWith(1);
    });

    it('should throw NotFound error for non-existent user', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce(null as unknown as User);

      await expect(usersController.delete(1)).rejects.toThrow(NotFound);

      expect(usersRepository.getUser).toHaveBeenCalledWith(1);
    });
  });

  describe('POST /users', () => {
    it('should save a new user', async () => {
      jest.spyOn(usersRepository, 'saveUser').mockResolvedValueOnce({ id: 1, name: 'John Doe', role: UserRole.USER, email: "testEmail", password: "password" });

      await expect(usersController.post({ id: 1, name: 'John Doe', role: UserRole.USER, email: "testEmail", password: "password" })).resolves.toBeDefined();

      expect(usersRepository.saveUser).toHaveBeenCalledWith({ id: 1, name: 'John Doe', role: 'USER', email: "testEmail", password: "password" });
    });
  });
});
