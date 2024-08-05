import User from "../../entity/user";
import { fetchUserByGoogleId } from "../../adapters/repositories/userRepository";

async function userFetchByGoogleIdUseCase(
  google_id: string
): Promise<User | null> {
  const userData = await fetchUserByGoogleId(google_id);

  if (!userData) {
    return null;
  }
  const user = new User(
    userData.id,
    userData.role_id,
    userData.name,
    userData.email,
    userData.email_verified_at,
    userData.remember_token as string,
    userData.google_id,
    userData.avatar,
    userData.deactivated,
    userData.created_at,
    userData.updated_at
  );
  return user;
}
export default userFetchByGoogleIdUseCase;
