import { AccountsController } from './AccountsController';
import { AccountsRepository } from '../../repositories/accounts';
import { NotFound } from '@tsed/exceptions';
import { Account, AccountType } from '../../dto/Account';
import { UsersRepository } from '../../repositories/users';
import { TransactionsRepository } from '../../repositories/transactions';
import { Transaction } from '../../dto/Transaction';

describe('AccountsController', () => {
  let mockAccountsRepository: Partial<AccountsRepository>;
  let mockUsersRepository: Partial<UsersRepository>;
  let mockTransactionsRepository: Partial<TransactionsRepository>;
  let accountsController: AccountsController;

  beforeEach(() => {
    mockAccountsRepository = {
      getAccounts: jest.fn(),
      getAccount: jest.fn(),
      saveAccount: jest.fn(),
      closeAccount: jest.fn(),
      modifyAccount: jest.fn(),
    };

    mockUsersRepository = {
      getUser: jest.fn(),
    };

    mockTransactionsRepository = {
      getAllTransactions: jest.fn(),
    };

    accountsController = new AccountsController(
      mockAccountsRepository as AccountsRepository, 
      mockUsersRepository as UsersRepository, 
      mockTransactionsRepository as TransactionsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return the accounts for a user', async () => {
      const userId = 1;
      const mockAccounts: Account[] = [
        { id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive:true },
        { id: 2, accountType: AccountType.CURRENT, balance: 500, userId: 1, isActive:true },
      ];
      (mockAccountsRepository.getAccounts as jest.Mock).mockResolvedValueOnce(mockAccounts);

      const result = await accountsController.get(userId);

      expect(result).toEqual(mockAccounts);
      expect(mockAccountsRepository.getAccounts).toHaveBeenCalledWith(userId);
    });
  });

  describe('put', () => {
    it('should update an existing account', async () => {
      const accountId = 1;
      const updatedAccount: Account = { id: 1, accountType: AccountType.CURRENT, balance: 500, userId: 1, isActive:true };
      const existingAccount: Account = { id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive:true };
      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(existingAccount);
      (mockAccountsRepository.saveAccount as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(accountsController.put(accountId, updatedAccount)).resolves.toBeUndefined();

      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(existingAccount.accountType).toBe(updatedAccount.accountType);
      expect(mockAccountsRepository.saveAccount).toHaveBeenCalledWith(existingAccount);
    });

    it('should throw NotFound error for non-existing account', async () => {
      const accountId = 1;
      const updatedAccount: Account = { id: 1, accountType: AccountType.CURRENT, balance: 500, userId: 1, isActive:true };
      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(null);

      await expect(accountsController.put(accountId, updatedAccount)).rejects.toThrow(NotFound);

      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(mockAccountsRepository.saveAccount).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete an existing account', async () => {
      const accountId = 1;
      const existingAccount: Account = { id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive:true };
      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(existingAccount);
      (mockAccountsRepository.closeAccount as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(accountsController.delete(accountId)).resolves.toBeUndefined();

      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(mockAccountsRepository.closeAccount).toHaveBeenCalledWith(existingAccount.id!);
    });

    it('should throw NotFound error for non-existing account', async () => {
      const accountId = 1;
      (mockAccountsRepository.getAccount as jest.Mock).mockResolvedValueOnce(null);

      await expect(accountsController.delete(accountId)).rejects.toThrow(NotFound);

      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(mockAccountsRepository.closeAccount).not.toHaveBeenCalled();
    });
  });

  describe('post', () => {
    it('should save a new account', async () => {
      const newAccount: Account = { id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive:true };
      (mockAccountsRepository.saveAccount as jest.Mock).mockResolvedValueOnce(undefined);
      (mockUsersRepository.getUser as jest.Mock).mockResolvedValueOnce({});


      await expect(accountsController.post(newAccount)).resolves.toBeUndefined();

      expect(mockAccountsRepository.saveAccount).toHaveBeenCalledWith(newAccount);
    });

    it('save a new account should reject if user doesnt exist', async () => {
      const newAccount: Account = { id: 1, accountType: AccountType.SAVINGS, balance: 1000, userId: 1, isActive:true };
      (mockAccountsRepository.saveAccount as jest.Mock).mockResolvedValueOnce(undefined);
      (mockUsersRepository.getUser as jest.Mock).mockResolvedValueOnce(undefined);


      await expect(accountsController.post(newAccount)).rejects.toThrowError("User not found");

      expect(mockAccountsRepository.saveAccount).not.toHaveBeenCalledWith(newAccount);
    });
  });

  describe("calculateInterest", () => {
    it("should calculate and add interest to a BasicSavings account", async () => {
      const accountId = 1;
      const existingAccount: Account = {
        id: accountId,
        accountType: AccountType.BASIC_SAVINGS,
        balance: 1000,
        userId: 1,
        isActive: true,
      };
  
      jest.spyOn(mockAccountsRepository, "getAccount").mockResolvedValueOnce(existingAccount);
      jest.spyOn(mockAccountsRepository, "saveAccount").mockResolvedValueOnce();
  
      await expect(accountsController.calculateInterest(accountId)).resolves.toBeUndefined();
  
      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(mockAccountsRepository.modifyAccount).toHaveBeenCalledWith(existingAccount);
      expect(existingAccount.balance).toBeCloseTo(1000 + (1000 * 0.05) / 12, 2);
    });
  
    it("should throw an error for non-BasicSavings accounts", async () => {
      const accountId = 1;
      const existingAccount: Account = {
        id: accountId,
        accountType: AccountType.CURRENT,
        balance: 1000,
        userId: 1,
        isActive: true,
      };
  
      jest.spyOn(mockAccountsRepository, "getAccount").mockResolvedValueOnce(existingAccount);
  
      await expect(accountsController.calculateInterest(accountId)).rejects.toThrowError("Interest calculation is only applicable to BasicSavings accounts");
  
      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(mockAccountsRepository.saveAccount).not.toHaveBeenCalled();
    });
  
    it("should throw an error for non-existent accounts", async () => {
      const accountId = 1;
  
      jest.spyOn(mockAccountsRepository, "getAccount").mockResolvedValueOnce(undefined);
  
      await expect(accountsController.calculateInterest(accountId)).rejects.toThrowError("Account not found");
  
      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(mockAccountsRepository.saveAccount).not.toHaveBeenCalled();
    });
  });

  describe("getAccountStatement", () => {
    it("should retrieve the account statement with transaction history and interest earned for a BasicSavings account", async () => {
      const accountId = 1;
      const existingAccount: Account = {
        id: accountId,
        accountType: AccountType.BASIC_SAVINGS,
        balance: 1000,
        userId: 1,
        isActive: true,
      };
      const transactions: Transaction[] = [
        { id: 1, fromAccountId: accountId, toAccountId: 2, amount: 100 },
        { id: 2, fromAccountId: accountId, toAccountId: 3, amount: 200 },
      ];
  
      jest.spyOn(mockAccountsRepository, "getAccount").mockResolvedValueOnce(existingAccount);
      jest.spyOn(mockTransactionsRepository, "getAllTransactions").mockResolvedValueOnce(transactions);
      const interestEarned = accountsController.calculateInterestEarned(existingAccount);
  
      const accountStatement = await accountsController.getAccountStatement(accountId);
  
      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(mockTransactionsRepository.getAllTransactions).toHaveBeenCalledWith(accountId, 0, 10);
      expect(accountStatement.account).toBe(existingAccount);
      expect(accountStatement.transactions).toBe(transactions);
      expect(accountStatement.interestEarned).toBe(interestEarned);
    });
  
    it("should retrieve the account statement with transaction history and zero interest earned for a non-BasicSavings account", async () => {
      const accountId = 1;
      const existingAccount: Account = {
        id: accountId,
        accountType: AccountType.CURRENT,
        balance: 1000,
        userId: 1,
        isActive: true,
      };
      const transactions: Transaction[] = [
        { id: 1, fromAccountId: accountId, toAccountId: 2, amount: 100 },
        { id: 2, fromAccountId: accountId, toAccountId: 3, amount: 200 },
      ];
  
      jest.spyOn(mockAccountsRepository, "getAccount").mockResolvedValueOnce(existingAccount);
      jest.spyOn(mockTransactionsRepository, "getAllTransactions").mockResolvedValueOnce(transactions);
  
      const accountStatement = await accountsController.getAccountStatement(accountId);
  
      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(mockTransactionsRepository.getAllTransactions).toHaveBeenCalledWith(accountId, 0, 10);
      expect(accountStatement.account).toBe(existingAccount);
      expect(accountStatement.transactions).toBe(transactions);
      expect(accountStatement.interestEarned).toBe(0);
    });
  
    it("should throw an error for a non-existent account", async () => {
      const accountId = 1;
  
      jest.spyOn(mockAccountsRepository, "getAccount").mockResolvedValueOnce(undefined);
  
      await expect(accountsController.getAccountStatement(accountId)).rejects.toThrowError("Account not found");
  
      expect(mockAccountsRepository.getAccount).toHaveBeenCalledWith(accountId);
      expect(mockTransactionsRepository.getAllTransactions).not.toHaveBeenCalled();
    });
  });
  
});
