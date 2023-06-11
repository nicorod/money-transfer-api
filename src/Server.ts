import {join} from "path";
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import "@tsed/swagger";
import {config} from "./config/index";
import * as accounts from "./controllers/accounts/index";
import * as transactions from "./controllers/transactions/index";
import * as users from "./controllers/users/index";
import { Pool } from "pg";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  mount: {
    "/users": [
      ...Object.values(users)
    ],
    "/accounts": [
      ...Object.values(accounts)
    ],
    "/transactions": [
      ...Object.values(transactions)
    ]
  },
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [
    "cors",
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    { use: "urlencoded-parser", options: { extended: true }}
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  private _pool: Pool;

  get pool() {
    return this._pool;
  }

  set pool(value: Pool) {
    this._pool = value;
  }

  @Configuration()
  protected settings: Configuration;

  $beforeRoutesInit(): void {
    this._pool = new Pool({
      user: "nicolasrodriguez1",
      database: "nicolasrodriguez",
      host: "localhost",
      port: 5432,
    });
  }
}
