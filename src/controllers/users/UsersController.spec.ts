import { PlatformTest } from '@tsed/common';
import { Server } from '../../Server'; // Assuming your server file is named Server.ts
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
    await PlatformTest.create(); // Create a test instance of the platform
    mockPool = ({
      connect: jest.fn(),
      query: jest.fn(),
      release: jest.fn(),
    } as unknown) as jest.Mocked<Pool>;
    
    usersRepository = new UsersRepository(mockPool); // Instantiate the users repository
    usersController = new UsersController(usersRepository); // Instantiate the users controller
  });

  afterEach(async () => {
    await PlatformTest.reset(); // Reset the test environment
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      // Mock the getAllUsers method in the repository
      jest.spyOn(usersRepository, 'getAllUsers').mockResolvedValueOnce([
        { id: 1, name: 'John Doe', role: UserRole.USER },
        { id: 2, name: 'Jane Smith', role: UserRole.ADMIN  },
      ]);

      // Call the getUsers method in the controller
      const result = await usersController.getUsers();

      // Assert the result
      expect(result).toEqual([
        { id: 1, name: 'John Doe', role: 'USER' },
        { id: 2, name: 'Jane Smith', role: 'ADMIN' },
      ]);
    });
  });

  describe('GET /users/:userId', () => {
    it('should return a user by ID', async () => {
      // Mock the getUser method in the repository
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce({ id: 1, name: 'John Doe', role: UserRole.USER });

      // Call the getUser method in the controller
      const result = await usersController.getUser(1);

      // Assert the result
      expect(result).toEqual({ id: 1, name: 'John Doe', role: 'USER' });
    });

    it('should return null for non-existent user', async () => {
      // Mock the getUser method in the repository
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce(null as unknown as User);

      // Call the getUser method in the controller
      const result = await usersController.getUser(1);

      // Assert the result
      expect(result).toBeNull();
    });
  });

  describe('PUT /users/:userId', () => {
    it('should update an existing user', async () => {
      // Mock the getUser and saveUser methods in the repository
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce({ id: 1, name: 'John Doe', role: UserRole.USER });
      jest.spyOn(usersRepository, 'saveUser').mockResolvedValueOnce();

      // Call the put method in the controller
      await expect(usersController.put(1, { id: 1, name: 'John Smith', role: UserRole.ADMIN })).resolves.toBeUndefined();

      // Assert that getUser and saveUser were called with the correct arguments
      expect(usersRepository.getUser).toHaveBeenCalledWith(1);
      expect(usersRepository.saveUser).toHaveBeenCalledWith({ id: 1, name: 'John Smith', role: 'ADMIN' });
    });

    it('should throw NotFound error for non-existent user', async () => {
      // Mock the getUser method in the repository
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce(null as unknown as User);

      // Call the put method in the controller
      await expect(usersController.put(1, { id: 1, name: 'John Smith', role: UserRole.ADMIN })).rejects.toThrow(NotFound);

      // Assert that getUser was called with the correct argument
      expect(usersRepository.getUser).toHaveBeenCalledWith(1);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete an existing user', async () => {
      // Mock the getUser and deleteUser methods in the repository
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce({ id: 1, name: 'John Doe', role: UserRole.USER });
      jest.spyOn(usersRepository, 'deleteUser').mockResolvedValueOnce();

      // Call the delete method in the controller
      await expect(usersController.delete(1)).resolves.toBeUndefined();

      // Assert that getUser and deleteUser were called with the correct argument
      expect(usersRepository.getUser).toHaveBeenCalledWith(1);
      expect(usersRepository.deleteUser).toHaveBeenCalledWith(1);
    });

    it('should throw NotFound error for non-existent user', async () => {
      // Mock the getUser method in the repository
      jest.spyOn(usersRepository, 'getUser').mockResolvedValueOnce(null as unknown as User);

      // Call the delete method in the controller
      await expect(usersController.delete(1)).rejects.toThrow(NotFound);

      // Assert that getUser was called with the correct argument
      expect(usersRepository.getUser).toHaveBeenCalledWith(1);
    });
  });

  describe('POST /users', () => {
    it('should save a new user', async () => {
      // Mock the saveUser method in the repository
      jest.spyOn(usersRepository, 'saveUser').mockResolvedValueOnce();

      // Call the post method in the controller
      await expect(usersController.post({ id: 1, name: 'John Doe', role: UserRole.USER })).resolves.toBeUndefined();

      // Assert that saveUser was called with the correct argument
      expect(usersRepository.saveUser).toHaveBeenCalledWith({ id: 1, name: 'John Doe', role: 'USER' });
    });
  });
});
