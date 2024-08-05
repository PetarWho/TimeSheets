import { fetchUsersCount } from "../../adapters/repositories/userRepository";

async function userFetchCountUseCase(): Promise<number> {
  return await fetchUsersCount();
}

export default userFetchCountUseCase;
