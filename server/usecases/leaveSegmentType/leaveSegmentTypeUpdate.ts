import LeaveSegmentType from "../../entity/leaveSegmentType";
import { updateLeaveSegmentType } from "../../adapters/repositories/leaveSegmentTypeRepository";

async function LeaveSegmentTypeUpdateUseCase(
  leaveSegmentTypeId: bigint,
  updatedLeaveSegmentTypeData: LeaveSegmentType
): Promise<{ message: string }> {
  const updatedLeaveSegmentType = await updateLeaveSegmentType(
    leaveSegmentTypeId,
    updatedLeaveSegmentTypeData
  );
  return updatedLeaveSegmentType;
}
export default LeaveSegmentTypeUpdateUseCase;
