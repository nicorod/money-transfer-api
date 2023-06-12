import { TransactionsController } from './TransactionsController';
import { TransactionsRepository } from '../../repositories/transactions';
import { AccountsRepository } from '../../repositories/accounts';
import { Transaction } from '../../dto/Transaction';
import { Account, AccountType } from '../../dto/Account';
import { Pool } from 'pg';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionsRepository: TransactionsRepository;
  let accountsRepository: AccountsRepository;
  let mockPool: jest.Mocked<Pool>;
  let mockAccountsRepository: Partial<AccountsRepository>;
  let mockTransactionsRepository: Partial<TransactionsRepository>;

  beforeEach(() => {
    mockPool = ({
      connect: jest.fn(),
      query: jest.fn(),
      release: jest.fn(),
    } as unknown) as jest.Mocked<Pool>;

    mockAccountsRepository = {
      getAccounts: jest.fn(),
      getAccount: jest.fn(),
      saveAccount: jest.fn(),
      closeAccount: jest.fn(),
    };

    mockTransactionsRepository = {
      saveTransaction: jest.fn(),
      getAllTransactions: jest.fn(),
    };

    transactionsRepository = new TransactionsRepository(mockPool);
    accountsRepository = new AccountsRepository(mockPool);

    transactionsController = new TransactionsController(mockTransactionsRepository as TransactionsRepository, mockAccountsRepository as AccountsRepository);
  });

  describe('get', () => {
    it('should return transactions for the specified account', async () => {
      const accountId = 1;
      const transactions: Transaction[] = [
        { id: 1, fromAccountId: 1, toAccountId: 2, amount: 100 },
        { id: 2, fromAccountId: 1, toAccountId: 3, amount: 50 }
      ];

      jest.spyOn(mockTransactionsRepository, 'getAllTransactions').mockResolvedValueOnce(transactions);

      const result = await transactionsController.get(accountId);

      expect(mockTransactionsRepository.getAllTransactions).toHaveBeenCalledWith(accountId, 0, 10);
      expect(result).toEqual(transactions);
    });
  });

  describe('post', () => {
    it('should save a new transaction', async () => {
      const accountId = 1;
      const newTransaction: Transaction = { fromAccountId: 1, toAccountId: 2, amount: 100 };

      (mockPool as any).connect = jest.fn().mockReturnThis();
      (mockPool as any).query = jest.fn().mockReturnThis();
      (mockPool as any).release = jest.fn().mockReturnThis();
      const existingAccount: Account = { id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive:true };
      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(existingAccount);

      const existingAccount2: Account = { id: 2, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive:true };
      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(existingAccount2);

      jest.spyOn(transactionsRepository, 'saveTransaction').mockResolvedValueOnce(undefined);
      (mockAccountsRepository.getAccounts as jest.Mock).mockResolvedValueOnce([]);
  
      await expect(transactionsController.post(accountId, newTransaction)).resolves.toBeUndefined();
  
      expect(mockAccountsRepository.getAccount).toHaveBeenCalledTimes(2);
    });

    it("should throw BadRequest if user account ID doesn't match transaction origin account ID", async () => {
      const accountId = 1;
      const newTransaction: Transaction = { fromAccountId: 3, toAccountId: 2, amount: 100 };

      await expect(transactionsController.post(accountId, newTransaction)).rejects.toThrowError("User account ID doesn't match transaction origin account ID");
      expect(mockAccountsRepository.getAccount).not.toHaveBeenCalled();
      expect(mockTransactionsRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it("should throw BadRequest if origin and destination are the same account", async () => {
      const accountId = 1;
      const newTransaction: Transaction = { fromAccountId: 1, toAccountId: 1, amount: 100 };

      await expect(transactionsController.post(accountId, newTransaction)).rejects.toThrowError("Invalid transaction: origin and destination are the same account");
      expect(mockAccountsRepository.getAccount).not.toHaveBeenCalled();
      expect(mockTransactionsRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it("should throw BadRequest if amount is not greater than 0", async () => {
      const accountId = 1;
      const newTransaction: Transaction = { fromAccountId: 1, toAccountId: 2, amount: 0 };

      await expect(transactionsController.post(accountId, newTransaction)).rejects.toThrowError("Invalid transaction: amount must be a number greater than 0");
      expect(mockAccountsRepository.getAccount).not.toHaveBeenCalled();
      expect(mockTransactionsRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it("should throw BadRequest if transaction amount exceeds origin account balance", async () => {
      const accountId = 1;
      const newTransaction: Transaction = { fromAccountId: 1, toAccountId: 2, amount: 600 };
      const fromAccount: Account = { id: 1, balance: 500, accountType: AccountType.BASIC_SAVINGS, isActive: true, userId: 1 };
      const toAccount: Account = { id: 2, balance: 300, accountType: AccountType.BASIC_SAVINGS, isActive: true, userId: 2 };

      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(fromAccount);
      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(toAccount);
      (mockAccountsRepository.getAccounts as jest.Mock).mockResolvedValueOnce([]);

      await expect(transactionsController.post(accountId, newTransaction)).rejects.toThrowError("Transaction amount exceeds origin account balance");
      expect(mockTransactionsRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it("should throw BadRequest if destination account not found", async () => {
      const accountId = 1;
      const newTransaction: Transaction = { fromAccountId: 1, toAccountId: 3, amount: 100 };
      const fromAccount: Account = { id: 1, balance: 500, accountType: AccountType.BASIC_SAVINGS, isActive: true, userId: 1 };

      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(undefined).mockResolvedValue(fromAccount);

      await expect(transactionsController.post(accountId, newTransaction)).rejects.toThrowError("Destination account not found");
      expect(mockTransactionsRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it("should throw BadRequest if destination account balance exceeds limit", async () => {
      const accountId = 1;
      const newTransaction: Transaction = { fromAccountId: 1, toAccountId: 3, amount: 11000 };
      const fromAccount: Account = { id: 1, balance: 500000, accountType: AccountType.BASIC_SAVINGS, isActive: true, userId: 1 };
      const toAccount: Account = { id: 1, balance: 40000, accountType: AccountType.BASIC_SAVINGS, isActive: true, userId: 1 };

      (mockAccountsRepository.getAccounts as jest.Mock).mockResolvedValueOnce([]);
      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(toAccount).mockResolvedValue(fromAccount);

      await expect(transactionsController.post(accountId, newTransaction)).rejects.toThrowError("The balance in the BasicSavings account type should never exceed Rs. 50,000");
      expect(mockTransactionsRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it("should throw BadRequest if destination account belongs to user", async () => {
      const accountId = 1;
      const newTransaction: Transaction = { fromAccountId: 1, toAccountId: 3, amount: 11000 };
      const fromAccount: Account = { id: 1, balance: 500000, accountType: AccountType.BASIC_SAVINGS, isActive: true, userId: 1 };
      const toAccount: Account = { id: 1, balance: 40000, accountType: AccountType.BASIC_SAVINGS, isActive: true, userId: 1 };

      (mockAccountsRepository.getAccounts as jest.Mock).mockResolvedValueOnce([toAccount]);
      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(toAccount).mockResolvedValue(fromAccount);

      await expect(transactionsController.post(accountId, newTransaction)).rejects.toThrowError("Invalid transaction: Transfer between accounts belonging to the same user is not allowed");
      expect(mockTransactionsRepository.saveTransaction).not.toHaveBeenCalled();
    });
  });
});
