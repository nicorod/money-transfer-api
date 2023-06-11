import {Controller} from "@tsed/di";
import {Delete, Get, Post, Put} from "@tsed/schema";
import { AccountsRepository } from "../../repositories/accounts";

@Controller("/accounts")
export class AccountsController {

  private accountsRepository: AccountsRepository;

  constructor(accountsRepository: AccountsRepository) {
    this.accountsRepository = accountsRepository;
  }

  @Get("/:userId")
  get() {
    return "hello";
  }

  @Put("/:accountId")
  put() {
    return "hello";
  }

  @Delete("/:accountId")
  delete() {
    return "hello";
  }

  @Post("/:userId")
  post() {
    return "hello";
  }
}


/*POST /api/accounts: Create a new account.
PUT /api/accounts/:accountId: Update account details.
DELETE /api/accounts/:accountId: Close an account.
GET /api/accounts/:accountId/statement: Get the account statement with transaction history and interest earned. This endpoint may include pagination parameters for retrieving specific pages of the statement.
*/