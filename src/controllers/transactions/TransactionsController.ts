import { BodyParams, PathParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { AccountsRepository } from "../../repositories/accounts";
import { Transaction } from "../../dto/Transaction";
import { TransactionsRepository } from "../../repositories/transactions";
import { AccountType } from "../../dto/Account";

@Controller("/")
export class TransactionsController {

  private transactionsRepository: TransactionsRepository;
  private accountsRepository: AccountsRepository;

  constructor(transactionsRepository: TransactionsRepository, accountsRepository: AccountsRepository) {
    this.transactionsRepository = transactionsRepository;
    this.accountsRepository = accountsRepository;
  }

  @Get("/accounts/:accountId")
  async get(@PathParams('accountId') accountId: number): Promise<Transaction[]> {
    return await this.transactionsRepository.getAllTransactions(accountId);
  }

  @Post('/accounts/:accountId')
  async post(@PathParams('accountId') accountId: number, @BodyParams() newTransaction: Transaction) {
    if (accountId !== newTransaction.fromAccountId)
      throw Error("User account ID doesn't match transaction origin account ID")
    if (newTransaction.fromAccountId === newTransaction.toAccountId)
      throw Error("Invalid transaction: origin and destination are the same account")
    if (newTransaction.amount <= 0)
      throw Error("Invalid transaction: amount must be a number greater than 0")
    
    const toAccount = await this.accountsRepository.getAccount(newTransaction.toAccountId);
    const fromAccount = await this.accountsRepository.getAccount(accountId);

    const userAccounts = await this.accountsRepository.getAccounts(fromAccount!.userId);

    if (!toAccount)
      throw Error("Destination account not found")

    if(userAccounts.includes(toAccount))
      throw Error("Invalid transaction: Transfer between accounts belonging to the same user is not allowed")

    if (newTransaction.amount > fromAccount!.balance)
      throw Error("Transaction amount exceeds origin account balance")

    const fromAccountNewBalance = fromAccount!.balance - newTransaction.amount;
    const toAccountNewBalance = toAccount!.balance + newTransaction.amount;

    if (toAccount.accountType === AccountType.BASIC_SAVINGS && toAccountNewBalance > 50000)
      throw Error("The balance in the BasicSavings account type should never exceed Rs. 50,000")

    return await this.transactionsRepository.saveTransaction(newTransaction, fromAccountNewBalance, toAccountNewBalance);
  }
}