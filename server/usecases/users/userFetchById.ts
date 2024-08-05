import User from "../../entity/user";
import { fetchUserById } from "../../adapters/repositories/userRepository";

async function userFetchByIdUseCase(userId: bigint): Promise<User | null> {
  const userData = await fetchUserById(userId);

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
export default userFetchByIdUseCase;
