import { Inject, Service } from "@tsed/di";
import { Pool, QueryResult } from 'pg';
import { Account, AccountType } from "../../dto/Account";

@Service()
export class AccountsRepository {
  @Inject()
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getAccounts(userId: number): Promise<Account[]> {
    
    const client = await this.pool.connect();

    try {
      const result: QueryResult = await client.query('SELECT * FROM accounts WHERE "userId" = $1 AND "isActive" = true', [userId]);

      return this._parseAccountsFromQueryResult(result)
    } finally {
      client.release();
    }
  }

  async getAccount(accountId: number): Promise<Account | undefined> {
    const client = await this.pool.connect();

    try {
      const result: QueryResult = await client.query('SELECT * FROM accounts WHERE id = $1 AND "isActive" = true', [accountId]);

      const accounts = this._parseAccountsFromQueryResult(result);
      return accounts? accounts[0] : undefined;
    } finally {
      client.release();
    }
  }

  async saveAccount(account: Account): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('INSERT INTO accounts (balance, type, "userId") VALUES ($1, $2, $3)', [account.balance, account.accountType, account.userId]);

    } finally {
      client.release();
    }
  }

  async modifyAccount(account: Account): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('UPDATE accounts SET balance = $1, type = $2 WHERE id = $3', [account.balance, account.accountType, account.userId]);

    } finally {
      client.release();
    }
  }

  async closeAccount(accountId: number): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('UPDATE accounts SET "isActive" = false WHERE id = $1', [accountId]);
    } finally {
      client.release();
    }
  }

  _parseAccountsFromQueryResult(queryResult: QueryResult): Account[] {

    return queryResult.rows.map((row) => {
      const { id, type , balance, userId, isActive } = row;
  
      return {
        id,
        accountType: type as AccountType,
        balance,
        userId, 
        isActive
      };
    });
  }
}