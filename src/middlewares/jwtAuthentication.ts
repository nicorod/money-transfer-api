import {Next, Req} from "@tsed/common";
import {Context} from "@tsed/platform-params";
import {Middleware, MiddlewareMethods, UseAuth} from "@tsed/platform-middlewares";
import {Forbidden, Unauthorized} from "@tsed/exceptions";
import { useDecorators } from "@tsed/core";
import { Security, In, Returns } from "@tsed/schema";
import { User } from "../dto/User";
import jwt from 'jsonwebtoken';

@Middleware()
export class CustomAuthMiddleware implements MiddlewareMethods {
  public use(@Req() request: Req, @Context() ctx: Context, @Next() next: Next) {

    const token = request.headers['Authorization']?.toString();

   if (!token) {
      throw new Unauthorized('Unauthorized');
    }

    try {
      const decoded = jwt.verify(token, '123456789');

      request.user = decoded;

      console.log("USER", decoded)

      next();
    } catch (err) {
      throw new Unauthorized('Unauthorized');
    }

    const options = ctx.endpoint.get(CustomAuthMiddleware) || {};

    if (!request.isAuthenticated()) {
      throw new Unauthorized("Unauthorized");
    }

    const user = request.user as User;

    if (user.role !== options.role) {
      throw new Forbidden("Forbidden");
    }
  }
}

export interface CustomAuthOptions extends Record<string, unknown> {
    role?: string;
    scopes?: string[];
  }
  
  export function CustomAuth(options: CustomAuthOptions = {}): Function {
    return useDecorators(
      UseAuth(CustomAuthMiddleware, options),
      Security("oauth", ...(options.scopes || [])),
      In("header").Name("Authorization").Type(String).Required(true),
      Returns(401),
      Returns(403)
    );
  }