import { RouterContext } from "../deps.ts";
import User from "../models/User.ts";
import {
  hashSync,
  compareSync,
  makeJwt,
  Jose,
  Payload,
  setExpiration,
} from "../deps.ts";

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

class AuthController {
  async login(ctx: RouterContext): Promise<void> {
    const body = ctx.request.body();
    const { email, password } = await body.value;
    if (!email || !password) {
      ctx.response.status = 422;
      ctx.response.body = { message: "Please provide email and password" };
      return;
    }
    try {
      const oldUser = await User.findOne({ email });
      if (!oldUser) {
        ctx.response.status = 422;
        ctx.response.body = { message: "Incorrect email." };
        return;
      }
      if (oldUser && !compareSync(password, oldUser.password)) {
        ctx.response.status = 422;
        ctx.response.body = { message: "Incorrect password." };
        return;
      }

      const payload: Payload = {
        iss: oldUser.email,
        exp: setExpiration(
          Date.now() + parseInt(Deno.env.get("JWT_EXP_DURATION") || "0"),
        ),
      };
      const jwt = await makeJwt({
        key: Deno.env.get("JWT_SECRET_KEY") || "",
        payload,
        header,
      });
      ctx.response.body = {
        id: oldUser.id,
        name: oldUser.name,
        email: oldUser.email,
        jwt,
      };
    } catch (e) {
      ctx.response.status = 422;
      ctx.response.body = { message: "Incorrect email." };
      return;
    }
  }
  async register(ctx: RouterContext): Promise<void> {
    const body = ctx.request.body();
    const { name, email, password } = await body.value;
    if (!name || !email || !password) {
      ctx.response.status = 422;
      ctx.response.body = {
        message: "Please provide name, email and password",
      };
      return;
    }
    try {
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        ctx.response.status = 422;
        ctx.response.body = { message: "Email is already used." };
        return;
      }
    } catch (e) {}
    const hashedPassword = hashSync(password);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    ctx.response.status = 201;
    ctx.response.body = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }
}

const authController = new AuthController();
export default authController;
