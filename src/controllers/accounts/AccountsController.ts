import { BodyParams, PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { Delete, Get, Post, Put } from "@tsed/schema";
import { UsersRepository } from "../../repositories/users";
import { Account, AccountStatement, AccountType } from "../../dto/Account";
import { AccountsRepository } from "../../repositories/accounts";
import { TransactionsRepository } from "../../repositories/transactions";
import { CustomAuth } from "../../middlewares/jwtAuthentication";

@Controller("/")
export class AccountsController {

  private accountsRepository: AccountsRepository;
  private usersRepository: UsersRepository;
  private transactionsRepository: TransactionsRepository;

  constructor(accountsRepository: AccountsRepository, usersRepository: UsersRepository, transactionsRepository: TransactionsRepository) {
    this.accountsRepository = accountsRepository;
    this.usersRepository = usersRepository;
    this.transactionsRepository = transactionsRepository;
  }

  @Get("/users/:userId")
  async get(@PathParams('userId') userId: number): Promise<Account[]> {
    return await this.accountsRepository.getAccounts(userId);
  }

  @Put("/:accountId")
  async put(@PathParams('accountId') accountId: number, @BodyParams() updatedAccount: Account): Promise<void> {

    const existingAccount = await this.accountsRepository.getAccount(accountId);

    if (!existingAccount) {
      throw new NotFound('Account not found');
    }

    existingAccount.accountType = updatedAccount.accountType;

    return await this.accountsRepository.saveAccount(existingAccount);
  }

  //@CustomAuth({role: "ADMIN", scopes: ["email"]})
  @Delete('/:accountId')
  async delete(@PathParams('accountId') accountId: number): Promise<void> {
    const existingAccount = await this.accountsRepository.getAccount(accountId);

    if (!existingAccount) {
      throw new NotFound('Account not found');
    }

    return await this.accountsRepository.closeAccount(existingAccount.id!);
  }

  @Post('/')
  async post(@BodyParams() newAccount: Account) {
    const existingUser = await this.usersRepository.getUser(newAccount.userId);

    if(newAccount.accountType === AccountType.BASIC_SAVINGS && newAccount.balance > 50000)
      throw Error("Basic savings account balance must not exceed Re. 50000")

    if (!existingUser) {
      throw new NotFound('User not found');
    }

    return await this.accountsRepository.saveAccount(newAccount);
  }

  @Put("/:accountId/calculate-interest")
  async calculateInterest(@PathParams("accountId") accountId: number): Promise<void> {
    const existingAccount = await this.accountsRepository.getAccount(accountId);

    if (!existingAccount) {
      throw new NotFound("Account not found");
    }

    if (existingAccount.accountType !== AccountType.BASIC_SAVINGS) {
      throw new Error("Interest calculation is only applicable to BasicSavings accounts");
    }

    const interestRate = 0.05;
    const monthlyInterest = (existingAccount.balance * interestRate) / 12;
    existingAccount.balance += parseInt(monthlyInterest.toString()) ;

    await this.accountsRepository.modifyAccount(existingAccount);
  }

  @Get("/:accountId/statement")
  async getAccountStatement(@PathParams("accountId") accountId: number, @QueryParams("page") page: number = 1, @QueryParams("pageSize") pageSize: number = 10): Promise<AccountStatement> {
    const offset = (page - 1) * pageSize;
    const existingAccount = await this.accountsRepository.getAccount(accountId);

    if (!existingAccount) {
      throw new NotFound("Account not found");
    }

    const transactions = await this.transactionsRepository.getAllTransactions(accountId, offset, pageSize);
    const interestEarned = this.calculateInterestEarned(existingAccount);

    const accountStatement: AccountStatement = {
      account: existingAccount,
      transactions,
      interestEarned,
    };

    return accountStatement;
  }

  public calculateInterestEarned(account: Account): number {
    if (account.accountType !== AccountType.BASIC_SAVINGS) {
      return 0;
    }

    const interestRate = 0.05;
    const monthlyInterest = (account.balance * interestRate) / 12;

    return monthlyInterest;
  }
}