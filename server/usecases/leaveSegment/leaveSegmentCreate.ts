import LeaveSegment from "../../entity/leaveSegment";
import { createLeaveSegment } from "../../adapters/repositories/leaveSegmentRepository";

async function leaveSegmentCreateUseCase(
  leaveSegmentData: LeaveSegment
): Promise<{ message: string }> {
  return await createLeaveSegment(leaveSegmentData);
}
export default leaveSegmentCreateUseCase;
