import { deleteJWT } from "../../adapters/repositories/authRepository";

async function userSignOutUseCase(token: string): Promise<{ message: string }> {
  return await deleteJWT(token);
}

export default userSignOutUseCase;
