import LeaveSegmentQueryParams from "../../ interfaces/leaveSegmentQueryParams";
import { fetchLeaveSegmentsCount } from "../../adapters/repositories/leaveSegmentRepository";
import {
  getUserIdFromToken,
  isAdminOrManager,
} from "../../utils/reusableFunctions";
import userFetchRoleIdUseCase from "../users/userFetchRoleId";

async function leaveSegmentFetchCountUseCase(
  token: string,
  params: LeaveSegmentQueryParams
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
    return await fetchLeaveSegmentsCount(params, undefined);
  }

  return await fetchLeaveSegmentsCount(params, BigInt(userId));
}

export default leaveSegmentFetchCountUseCase;
