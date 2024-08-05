import LeaveSegment from "../../entity/leaveSegment";
import { updateLeaveSegment } from "../../adapters/repositories/leaveSegmentRepository";

async function leaveSegmentUpdateUseCase(
  leaveSegmentId: bigint,
  updatedLeaveSegmentData: LeaveSegment
): Promise<{ message: string }> {
  return await updateLeaveSegment(leaveSegmentId, updatedLeaveSegmentData);
}

export default leaveSegmentUpdateUseCase;
