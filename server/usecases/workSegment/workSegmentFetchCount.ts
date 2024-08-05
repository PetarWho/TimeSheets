import WorkSegmentQueryParams from "../../ interfaces/workSegmentQueryParams";
import { fetchWorkSegmentsCount } from "../../adapters/repositories/workSegmentRepository";
import {
  getUserIdFromToken,
  isAdminOrManager,
} from "../../utils/reusableFunctions";
import userFetchRoleIdUseCase from "../users/userFetchRoleId";

async function workSegmentFetchCountUseCase(
  token: string,
  params: WorkSegmentQueryParams
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
    return await fetchWorkSegmentsCount(params, undefined);
  }

  return await fetchWorkSegmentsCount(params, BigInt(userId));
}

export default workSegmentFetchCountUseCase;
