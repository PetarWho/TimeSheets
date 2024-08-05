import User from "../../entity/user";
import bcrypt from "bcrypt";
import { createUser } from "../../adapters/repositories/userRepository";
import userSignIn from "./userSignIn";

async function userSignUpUseCase(userData: User): Promise<{ token: string }> {
  if (!userData.email || !userData.name || !userData.password) {
    throw new Error("Please fill in all the fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw new Error("Invalid email format");
  }

  const hashedPassword = await bcrypt.hash(userData.password as string, 10);
  const user = new User(
    userData.id,
    userData.role_id,
    userData.name,
    userData.email,
    userData.email_verified_at,
    userData.remember_token,
    userData.google_id,
    userData.avatar,
    userData.deactivated,
    userData.created_at,
    userData.updated_at
  );
  user.password = hashedPassword;

  const createUserResponse = await createUser(user);

  if (createUserResponse) {
    return await userSignIn(userData.email, userData.password as string);
  } else {
    throw new Error("Failed to sign up user");
  }
}

export default userSignUpUseCase;
