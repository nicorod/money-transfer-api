import { PlatformTest } from '@tsed/common';
import { AccountsController } from '../accounts/AccountsController';
import { TransactionsRepository } from '../../repositories/transactions/TransactionsRepository';
import { Transaction } from '../../dto/Transaction';
import { AccountsRepository } from 'src/repositories/accounts';
import { TransactionsController } from './TransactionsController';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let mockTransactionsRepository: TransactionsRepository;

  beforeEach(async () => {
    await PlatformTest.create();
    mockTransactionsRepository = {
      getAllTransactions: jest.fn(),
      saveTransaction: jest.fn(),
    } as unknown as TransactionsRepository;
  
    transactionsController = new TransactionsController(mockTransactionsRepository);
  });

  afterEach(async () => {
    await PlatformTest.reset();
  });

  describe('get', () => {
    it('should return transactions for the specified account', async () => {
      const accountId = 1;
      const expectedTransactions: Transaction[] = [
        { id: 1, fromAccountId: 1, toAccountId: 2, amount: 100 },
        { id: 2, fromAccountId: 1, toAccountId: 3, amount: 200 },
      ];
      jest
        .spyOn(mockTransactionsRepository, 'getAllTransactions')
        .mockResolvedValueOnce(expectedTransactions);

      const result = await transactionsController.get(accountId);

      expect(result).toEqual(expectedTransactions);

      expect(mockTransactionsRepository.getAllTransactions).toHaveBeenCalledWith(accountId);
    });
  });

  describe('post', () => {
    it('should save a new transaction', async () => {
      const newTransaction: Transaction = { fromAccountId: 1, toAccountId: 2, amount: 100 };
      jest.spyOn(mockTransactionsRepository, 'saveTransaction').mockResolvedValueOnce(undefined);

      await expect(transactionsController.post(1, newTransaction)).resolves.toBeUndefined();

      expect(mockTransactionsRepository.saveTransaction).toHaveBeenCalledWith(newTransaction);
    });

    it('should throw an error if the user account ID does not match the transaction origin account ID', async () => {
      const invalidTransaction: Transaction = { fromAccountId: 1, toAccountId: 1, amount: 100 };

      await expect(transactionsController.post(2, invalidTransaction)).rejects.toThrow(
        "User account ID doesn't match transaction origin account ID"
      );

      expect(mockTransactionsRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it('should throw an error if the user account ID does match the transaction destination account ID', async () => {
      const invalidTransaction: Transaction = { fromAccountId: 1, toAccountId: 1, amount: 100 };

      await expect(transactionsController.post(1, invalidTransaction)).rejects.toThrow(
        "Invalid transaction: origin and destination are the same account"
      );

      expect(mockTransactionsRepository.saveTransaction).not.toHaveBeenCalled();
    });

  });
});
