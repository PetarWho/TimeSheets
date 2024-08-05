import WorkSegment from "../../entity/workSegment";
import {
  fetchAllWorkSegments,
  fetchWorkSegmentsByUserId,
} from "../../adapters/repositories/workSegmentRepository";
import CalendarQueryParams from "../../ interfaces/calendarQueryParams";
import {
  getUserIdFromToken,
  isAdminOrManager,
} from "../../utils/reusableFunctions";
import userFetchRoleIdUseCase from "../users/userFetchRoleId";
import workSegmentFetchByUserIdUseCase from "./workSegmentFetchByUserId";

async function workSegmentFetchAllUseCase(
  token: string,
  params: CalendarQueryParams
): Promise<WorkSegment[]> {
  const userId = await getUserIdFromToken(token);
  if (!userId) {
    throw new Error("Invalid User!");
  }

  const roleId = await userFetchRoleIdUseCase(BigInt(userId));
  if (!roleId) {
    throw new Error("Invalid Role!");
  }

  let allWorkSegments: WorkSegment[] = [];

  if (await isAdminOrManager(roleId)) {
    allWorkSegments = await fetchAllWorkSegments(params);
  } else {
    allWorkSegments = await workSegmentFetchByUserIdUseCase(
      BigInt(userId),
      params
    );
  }

  const workSegments = allWorkSegments.map(
    (workSegmentData: WorkSegment) =>
      new WorkSegment(
        workSegmentData.id,
        workSegmentData.date,
        workSegmentData.hours,
        workSegmentData.notes,
        workSegmentData.project_id,
        workSegmentData.user_id,
        workSegmentData.work_segment_type_id,
        workSegmentData.created_at,
        workSegmentData.updated_at
      )
  );
  return workSegments;
}

export default workSegmentFetchAllUseCase;
