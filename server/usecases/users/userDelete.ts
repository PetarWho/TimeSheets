import { deleteUser } from "../../adapters/repositories/userRepository";
import User from "../../entity/user";

async function userDeleteUseCase(userId: bigint): Promise<{ message: string }> {
  return await deleteUser(userId);
}
export default userDeleteUseCase;
