import { deactivateUser } from "../../adapters/repositories/userRepository";
import User from "../../entity/user";

async function userDeactivateUseCase(
  userId: bigint,
  value: boolean
): Promise<{ message: string }> {
  if (!(typeof value === "boolean" || value === 0 || value === 1)) {
    throw new Error("Value should be true or false");
  }
  return await deactivateUser(userId, value);
}

export default userDeactivateUseCase;
