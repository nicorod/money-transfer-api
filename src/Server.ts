import {join} from "path";
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import "@tsed/swagger";
import {config} from "./config/index";
import * as accounts from "./controllers/accounts/index";
import * as users from "./controllers/users/index";
import * as pages from "./controllers/pages/index";
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
    "/": [
      ...Object.values(pages)
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
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
}
