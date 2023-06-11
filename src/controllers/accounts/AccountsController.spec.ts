import { PlatformTest } from "@tsed/common";
import { AccountsController } from "./AccountsController";

describe("UsersController", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should do something", () => {
    const instance = PlatformTest.get<AccountsController>(AccountsController);
    // const instance = PlatformTest.invoke<UsersController>(UsersController); // get fresh instance

    expect(instance).toBeInstanceOf(AccountsController);
  });
});
