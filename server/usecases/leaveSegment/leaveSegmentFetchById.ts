import LeaveSegment from "../../entity/leaveSegment";
import { fetchLeaveSegmentById } from "../../adapters/repositories/leaveSegmentRepository";

async function leaveSegmentFetchByIdUseCase(
  leaveSegmentId: bigint
): Promise<LeaveSegment | null> {
  const leaveSegmentData = await fetchLeaveSegmentById(leaveSegmentId);
  if (leaveSegmentData) {
    const leaveSegment = new LeaveSegment(
      leaveSegmentData.id,
      leaveSegmentData.start_date,
      leaveSegmentData.end_date,
      leaveSegmentData.notes,
      leaveSegmentData.user_id,
      leaveSegmentData.leave_segment_type_id,
      leaveSegmentData.created_at,
      leaveSegmentData.updated_at,
      leaveSegmentData.status
    );
    return leaveSegment;
  } else {
    return null;
  }
}

export default leaveSegmentFetchByIdUseCase;
