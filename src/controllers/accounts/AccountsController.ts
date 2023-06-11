import { BodyParams, PathParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { Delete, Get, Post, Put } from "@tsed/schema";
import { UsersRepository } from "../../repositories/users";
import { Account, AccountType } from "../../dto/Account";
import { AccountsRepository } from "../../repositories/accounts";

@Controller("/")
export class AccountsController {

  private accountsRepository: AccountsRepository;
  private usersRepository: UsersRepository;

  constructor(accountsRepository: AccountsRepository, usersRepository: UsersRepository) {
    this.accountsRepository = accountsRepository;
    this.usersRepository = usersRepository;
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
    existingAccount.balance += monthlyInterest;

    await this.accountsRepository.modifyAccount(existingAccount);
  }
}