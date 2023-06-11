import { Inject, Service } from "@tsed/di";
import { Pool, QueryResult } from 'pg';
import { Transaction } from "src/dto/Transaction";

@Service()
export class TransactionsRepository {
  @Inject()
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getAllTransactions(accountId: number): Promise<Transaction[]> {
    const client = await this.pool.connect();

    try {
      const result: QueryResult = await client.query('SELECT * FROM Transaction WHERE fromAccountId = $1 OR toAccountId = $1', [accountId]);

      return this._parseTransactionsFromQueryResult(result)
    } finally {
      client.release();
    }
  }


  async saveTransaction(transaction: Transaction): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('INSERT INTO users (fromAccountId, toAccountId, amount) VALUES ($1, $2, $3)', [transaction.fromAccountId, transaction.toAccountId, transaction.amount]);

    } finally {
      client.release();
    }
  }

  _parseTransactionsFromQueryResult(queryResult: QueryResult): Transaction[] {
    return queryResult.rows.map((row) => {
      const { id, fromAccountId, toAccountId, amount } = row;
  
      return {
        id, fromAccountId, toAccountId, amount
      };
    });
  }
}