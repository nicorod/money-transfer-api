import { Inject, Service } from "@tsed/di";
import { Pool, QueryResult } from 'pg';
import { User, UserRole } from "src/dto/User";

@Service()
export class UsersRepository {
  @Inject()
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getAllUsers(): Promise<User[]> {
    const client = await this.pool.connect();

    try {
      const result: QueryResult = await client.query('SELECT * FROM users');

      return this._parseUsersFromQueryResult(result)
    } finally {
      client.release();
    }
  }

  async getUser(userId: number): Promise<User> {
    const client = await this.pool.connect();

    try {
      const result: QueryResult = await client.query('SELECT * FROM users where id = $1', [userId]);

      return this._parseUsersFromQueryResult(result)[0]
    } finally {
      client.release();
    }
  }

  async saveUser(user: User): Promise<User> {
    const client = await this.pool.connect();

    try {
      await client.query('INSERT INTO users (name, role, email, password) VALUES ($1, $2, $3, $4);', [user.name, user.role, user.email, user.password]);
      const result: QueryResult = await client.query('SELECT * FROM users ORDER BY id DESC LIMIT 1;');
      return this._parseUsersFromQueryResult(result)[0];
    } finally {
      client.release();
    }
  }

  async updateUser(userId: number, user: User): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('UPDATE users SET name = $2, role = $3, email = $4, password = $5 WHERE id = $1;', [userId, user.name, user.role, user.email, user.password]);

    } finally {
      client.release();
    }
  }

  async deleteUser(userId: number): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('DELETE FROM users where id = $1', [userId]);
    } finally {
      client.release();
    }
  }

  _parseUsersFromQueryResult(queryResult: QueryResult): User[] {
    return queryResult.rows.map((row) => {
      const { id, name, role, email, password } = row;
  
      return {
        id,
        name,
        role: role as UserRole,
        email,
        password
      };
    });
  }
}