import LeaveSegmentType from "../../entity/leaveSegmentType";
import { deleteLeaveSegmentType } from "../../adapters/repositories/leaveSegmentTypeRepository";

async function leaveSegmentTypeDeleteUseCase(
  leaveSegmentTypeId: bigint
): Promise<{ message: string }> {
  return await deleteLeaveSegmentType(leaveSegmentTypeId);
}

export default leaveSegmentTypeDeleteUseCase;
