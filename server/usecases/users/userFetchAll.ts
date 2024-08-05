import User from "../../entity/user";
import { fetchAllUsers } from "../../adapters/repositories/userRepository";
import UserQueryParams from "../../ interfaces/userQueryParams";
async function userFetchAllUseCase(params: UserQueryParams): Promise<User[]> {
  const allUsers: User[] = await fetchAllUsers(params);

  return allUsers.map(
    (userData: User) =>
      new User(
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
      )
  );
}

export default userFetchAllUseCase;
