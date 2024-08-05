import CalendarQueryParams from "../../ interfaces/calendarQueryParams";
import { fetchProjectsCount } from "../../adapters/repositories/projectRepository";
import {
  getUserIdFromToken,
  isAdminOrManager,
} from "../../utils/reusableFunctions";
import userFetchRoleIdUseCase from "../users/userFetchRoleId";

async function projectFetchCountUseCase(
  token: string,
  params: CalendarQueryParams
): Promise<number> {
  const userId = await getUserIdFromToken(token);
  if (!userId) {
    throw new Error("Invalid User!");
  }

  const roleId = await userFetchRoleIdUseCase(BigInt(userId));
  if (!roleId) {
    throw new Error("Invalid Role!");
  }

  if (await isAdminOrManager(roleId)) {
    return await fetchProjectsCount(params, undefined);
  }
  return await fetchProjectsCount(params, BigInt(userId));
}

export default projectFetchCountUseCase;
