import { createLeaveSegmentType } from "../../adapters/repositories/leaveSegmentTypeRepository";
import LeaveSegmentType from "../../entity/leaveSegmentType";

async function leaveSegmentTypeCreateUseCase(
  leaveSegmentTypeData: LeaveSegmentType
): Promise<{ message: string }> {
  return await createLeaveSegmentType(leaveSegmentTypeData);
}

export default leaveSegmentTypeCreateUseCase;
