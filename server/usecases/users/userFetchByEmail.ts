import User from "../../entity/user";
import { fetchUserByEmail } from "../../adapters/repositories/userRepository";

async function userFetchByEmailUseCase(email: string): Promise<User | null> {
  const userData = await fetchUserByEmail(email);

  if (!userData) {
    return null;
  }
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
  return user;
}
export default userFetchByEmailUseCase;
