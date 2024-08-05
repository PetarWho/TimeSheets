import { setRoleOfUser } from "../../adapters/repositories/userRepository";

async function userSetRoleUseCase(
  userId: bigint,
  role_id: bigint
): Promise<{ message: string }> {
  return await setRoleOfUser(userId, role_id);
}

export default userSetRoleUseCase;
