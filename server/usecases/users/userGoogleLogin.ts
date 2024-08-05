import User from "../../entity/user";
import { createUser } from "../../adapters/repositories/userRepository";
import userSignInUseCase from "./userSignIn";
import userUpdateUseCase from "./userUpdate";
import userFetchByGoogleIdUseCase from "./userFetchByGoogleId";
import userFetchByEmailUseCase from "./userFetchByEmail";

async function userGoogleLoginUseCase(
  userData: User
): Promise<{ token: string }> {
  let userByGoogle = await userFetchByGoogleIdUseCase(userData.google_id);
  let userByEmail = await userFetchByEmailUseCase(userData.email);
  if (userByGoogle && userByEmail && userByEmail.email != userByGoogle.email) {
    throw new Error("This Google account is linked to another account!");
  }

  let user: User | null = userByEmail ?? userByGoogle;

  let response: { message: string } | null = null;

  if (!user) {
    response = await createUser(userData);
    user = userData;
  } else {
    user.avatar = userData.avatar;
    user.google_id = userData.google_id;
    if (!user.email_verified_at) {
      user.email_verified_at = userData.email_verified_at;
    }
    response = await userUpdateUseCase(user.id, user);
  }

  if (response) {
    return await userSignInUseCase(user.email, userData.google_id, true);
  } else {
    throw new Error("Failed to sign up user");
  }
}

export default userGoogleLoginUseCase;
