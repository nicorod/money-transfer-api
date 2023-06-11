import { BodyParams, PathParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { Transaction } from "../../dto/Transaction";
import { TransactionsRepository } from "../../repositories/transactions";

@Controller("/transactions")
export class TransactionsController {

  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  @Get("/accounts/:accountId")
  async get(@PathParams('accountId') accountId: number): Promise<Transaction[]> {
    return await this.transactionsRepository.getAllTransactions(accountId);
  }

  @Post('/accounts/:accountId')
  async post(@PathParams('accountId') accountId: number, @BodyParams() newTransaction: Transaction) {
    console.log(accountId, newTransaction.fromAccountId)
    if (accountId !== newTransaction.fromAccountId)
      throw Error("User account ID doesn't match transaction origin account ID")
    if (newTransaction.fromAccountId === newTransaction.toAccountId)
      throw Error("Invalid transaction: origin and destination are the same account")

    return await this.transactionsRepository.saveTransaction(newTransaction);
  }
}