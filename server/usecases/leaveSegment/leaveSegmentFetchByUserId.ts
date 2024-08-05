import LeaveSegment from "../../entity/leaveSegment";
import { fetchLeaveSegmentsByUserId } from "../../adapters/repositories/leaveSegmentRepository";
import LeaveSegmentQueryParams from "../../ interfaces/leaveSegmentQueryParams";
async function leaveSegmentFetchByUserIdUseCase(
  userId: bigint,
  params: LeaveSegmentQueryParams
): Promise<LeaveSegment[]> {
  const allLeaveSegments: LeaveSegment[] = await fetchLeaveSegmentsByUserId(
    userId,
    params
  );
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
export default leaveSegmentFetchByUserIdUseCase;
