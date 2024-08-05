import { fetchUserRole } from "../../adapters/repositories/userRepository";

async function userFetchRoleIdUseCase(userId: bigint): Promise<bigint | null> {
  const role = await fetchUserRole(userId);
  if (!role) {
    return null;
  }

  return role;
}
export default userFetchRoleIdUseCase;
