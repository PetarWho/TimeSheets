import LeaveSegment from "../../entity/leaveSegment";
import { fetchAllLeaveSegments } from "../../adapters/repositories/leaveSegmentRepository";
import {
  getUserIdFromToken,
  isAdminOrManager,
} from "../../utils/reusableFunctions";
import userFetchRoleIdUseCase from "../users/userFetchRoleId";
import LeaveSegmentQueryParams from "../../ interfaces/leaveSegmentQueryParams";
import leaveSegmentFetchByUserIdUseCase from "./leaveSegmentFetchByUserId";
async function leaveSegmentFetchAllUseCase(
  token: string,
  params: LeaveSegmentQueryParams
): Promise<LeaveSegment[]> {
  const userId = await getUserIdFromToken(token);
  if (!userId) {
    throw new Error("Invalid User!");
  }

  const roleId = await userFetchRoleIdUseCase(BigInt(userId));
  if (!roleId) {
    throw new Error("Invalid Role!");
  }

  let allLeaveSegments: LeaveSegment[] = [];

  if (await isAdminOrManager(roleId)) {
    allLeaveSegments = await fetchAllLeaveSegments(params);
  } else {
    allLeaveSegments = await leaveSegmentFetchByUserIdUseCase(
      BigInt(userId),
      params
    );
  }

  const leaveSegments = allLeaveSegments.map(
    (leaveSegmentData: LeaveSegment) =>
      new LeaveSegment(
        leaveSegmentData.id,
        leaveSegmentData.start_date,
        leaveSegmentData.end_date,
        leaveSegmentData.notes,
        leaveSegmentData.user_id,
        leaveSegmentData.leave_segment_type_id,
        leaveSegmentData.created_at,
        leaveSegmentData.updated_at,
        leaveSegmentData.status
      )
  );
  return leaveSegments;
}
export default leaveSegmentFetchAllUseCase;
