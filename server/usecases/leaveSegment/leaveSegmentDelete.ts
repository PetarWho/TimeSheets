import { deleteLeaveSegment } from "../../adapters/repositories/leaveSegmentRepository";

async function leaveSegmentDeleteUseCase(
  leaveSegmentId: bigint
): Promise<{ message: string }> {
  return await deleteLeaveSegment(leaveSegmentId);
}

export default leaveSegmentDeleteUseCase;
