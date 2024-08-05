import { updateUser } from "../../adapters/repositories/userRepository";
import User from "../../entity/user";

async function userUpdateUseCase(
  userId: bigint,
  updatedUserData: User
): Promise<{ message: string }> {
  const updatedUser = await updateUser(userId, updatedUserData);
  return updatedUser;
}

export default userUpdateUseCase;
