import { PlatformTest } from '@tsed/common';
import { Pool, QueryResult } from 'pg';
import { TransactionsRepository } from './TransactionsRepository';

describe('TransactionsRepository', () => {
  let transactionsRepository: TransactionsRepository;
  let mockPool: Pool;

  beforeEach(async () => {
    await PlatformTest.create();
    mockPool = ({
      connect: jest.fn(),
      query: jest.fn(),
      release: jest.fn(),
    } as unknown) as jest.Mocked<Pool>;
    transactionsRepository = new TransactionsRepository(mockPool);
  });

  afterEach(async () => {
    await PlatformTest.reset();
  });

  describe('getAllTransactions', () => {
    it('should return all transactions', async () => {
      jest.spyOn(mockPool, 'connect').mockImplementation(() => ({
        query: jest.fn().mockResolvedValueOnce({
          rows: [
            { id: 1, fromAccountId: 1, toAccountId: 2, amount: 100 },
            { id: 2, fromAccountId: 2, toAccountId: 1, amount: 200 },
          ],
        } as QueryResult),
        release: jest.fn(),
      }));

      const result = await transactionsRepository.getAllTransactions(1);

      expect(result).toEqual([
        { id: 1, fromAccountId: 1, toAccountId: 2, amount: 100 },
        { id: 2, fromAccountId: 2, toAccountId: 1, amount: 200 },
      ]);
    });
  });

  describe('saveTransaction', () => {
    it("should save a new transaction and commit the changes", async () => {
      const transaction = { fromAccountId: 1, toAccountId: 2, amount: 100 };
      const newBalance = 400;
      const newBalance2 = 500;
      const mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      };

      // Mock the pool's `connect` method to return the mock client
      (mockPool.connect as jest.Mock).mockResolvedValueOnce(mockClient);

      await transactionsRepository.saveTransaction(transaction, newBalance, newBalance2);

      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenNthCalledWith(1, "BEGIN");
      expect(mockClient.query).toHaveBeenNthCalledWith(2, "INSERT INTO Transactions (\"fromAccountId\", \"toAccountId\", amount) VALUES ($1, $2, $3);", [transaction.fromAccountId, transaction.toAccountId, transaction.amount]);
      expect(mockClient.query).toHaveBeenNthCalledWith(3, "UPDATE accounts SET balance = $2 WHERE id = $1;", [transaction.fromAccountId, newBalance]);
      expect(mockClient.query).toHaveBeenNthCalledWith(4, "UPDATE accounts SET balance = $2 WHERE id = $1;", [transaction.toAccountId, newBalance2]);
      expect(mockClient.query).toHaveBeenNthCalledWith(5, "COMMIT");
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("should rollback the changes if an error occurs", async () => {
      const transaction = { fromAccountId: 1, toAccountId: 2, amount: 100 };
      const newBalance = 400;
      const newBalance2 = 500;
      const mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      };

      // Mock the pool's `connect` method to return the mock client
      (mockPool.connect as jest.Mock).mockResolvedValueOnce(mockClient);

      // Mock an error in the query
      (mockClient.query as jest.Mock).mockRejectedValueOnce(new Error("Query error"));

      await expect(transactionsRepository.saveTransaction(transaction, newBalance, newBalance2)).rejects.toThrow(Error);

      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenNthCalledWith(1, "BEGIN");
      expect(mockClient.query).toHaveBeenNthCalledWith(2, "ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});
