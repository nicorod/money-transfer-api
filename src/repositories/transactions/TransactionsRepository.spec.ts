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
    it('should save a new transaction', async () => {
      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();

      await expect(
        transactionsRepository.saveTransaction({ fromAccountId: 1, toAccountId: 2, amount: 100 })
      ).resolves.toBeUndefined();

      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO users (fromAccountId, toAccountId, amount) VALUES ($1, $2, $3)',
        [1, 2, 100]
      );
    });
  });
});
