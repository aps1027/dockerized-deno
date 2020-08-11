import { RouterContext, validateJwt } from "../deps.ts";
import User from "../models/User.ts";

export const authMiddleware = async (
  ctx: RouterContext,
  next: Function,
): Promise<void> => {
  const headers = ctx.request.headers;

  const authHeader = headers.get("Authorization");
  if (!authHeader) {
    ctx.response.status = 401;
    return;
  }
  const jwt = authHeader.split(" ")[1];
  if (!jwt) {
    ctx.response.status = 401;
    return;
  }
  const data: any = await validateJwt({
    jwt,
    key: Deno.env.get("JWT_SECRET_KEY") || "",
    algorithm: "HS256",
  });
  if (data.isValid) {
    try {
      const user = await User.findOne({ email: data.payload?.iss });
      ctx.state.user = user;
      await next();
    } catch (e) {
      ctx.response.status = 401;
      return;
    }
  } else {
    ctx.response.status = 401;
  }
};
