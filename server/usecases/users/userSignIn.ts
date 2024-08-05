import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fetchUserByEmail } from "../../adapters/repositories/userRepository";
import { createJWT } from "../../adapters/repositories/authRepository";
import User from "../../entity/user";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: any = process.env.JWT_SECRET;
const JWT_EXPIRATION: any = process.env.JWT_EXPIRATION;

async function userSignInUseCase(
  email: string,
  password: string,
  isGoogleLogin: boolean = false
): Promise<{ token: string }> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  let user: User | undefined = await fetchUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!isGoogleLogin) {
    const passwordMatch = await bcrypt.compare(password, user.password || "");

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }
  } else {
    if (user.google_id != password) {
      throw new Error("Invalid Google ID");
    }
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  await createJWT(user.id, token);
  return { token };
}

export default userSignInUseCase;
