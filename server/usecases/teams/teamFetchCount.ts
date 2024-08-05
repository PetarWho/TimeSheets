import CalendarQueryParams from "../../ interfaces/calendarQueryParams";
import { fetchTeamsCount } from "../../adapters/repositories/teamRepository";
import {
  getUserIdFromToken,
  isAdminOrManager,
} from "../../utils/reusableFunctions";
import userFetchRoleIdUseCase from "../users/userFetchRoleId";

async function teamFetchCountUseCase(
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
    return await fetchTeamsCount(params, undefined);
  }
  return await fetchTeamsCount(params, BigInt(userId));
}

export default teamFetchCountUseCase;
