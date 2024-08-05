import User from "../../entity/user";
import { fetchUsersThatAreNotMembersOfTeam } from "../../adapters/repositories/userRepository";
async function userFetchNonSpecificTeamMembersUseCase(
  team_id: bigint
): Promise<User[]> {
  const users: User[] = await fetchUsersThatAreNotMembersOfTeam(team_id);

  return users.map(
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

export default userFetchNonSpecificTeamMembersUseCase;
