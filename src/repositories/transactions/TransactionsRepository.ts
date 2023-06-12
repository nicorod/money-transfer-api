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

  async getAllTransactions(accountId: number, offset: number, pageSize: number): Promise<Transaction[]> {
    const client = await this.pool.connect();

    try {
      const query = `
      SELECT * FROM Transactions
      WHERE "fromAccountId" = $1 OR "toAccountId" = $1
      OFFSET $2 LIMIT $3
    `;
      const values = [accountId, offset, pageSize];
      const result: QueryResult = await client.query(query, values);

      return this._parseTransactionsFromQueryResult(result)
    } finally {
      client.release();
    }
  }


  async saveTransaction(transaction: Transaction, fromAccountNewBalance: number, toAccountNewBalance: number): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO Transactions ("fromAccountId", "toAccountId", amount, time) VALUES ($1, $2, $3, $4);', [transaction.fromAccountId, transaction.toAccountId, transaction.amount, Date.now]);
      await client.query('UPDATE accounts SET balance = $2 WHERE id = $1;', [transaction.fromAccountId, fromAccountNewBalance]);
      await client.query('UPDATE accounts SET balance = $2 WHERE id = $1;', [transaction.toAccountId, toAccountNewBalance]);
      await client.query('COMMIT');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
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