import LeaveSegmentType from "../../entity/leaveSegmentType";
import { fetchLeaveSegmentTypeById } from "../../adapters/repositories/leaveSegmentTypeRepository";

async function leaveSegmentTypeFetchByIdUseCase(
  leaveSegmentTypeId: bigint
): Promise<LeaveSegmentType | null> {
  const leaveSegmentTypeData =
    await fetchLeaveSegmentTypeById(leaveSegmentTypeId);

  if (!leaveSegmentTypeData) {
    return null;
  }

  const leaveSegmentType = new LeaveSegmentType(
    leaveSegmentTypeData.id,
    leaveSegmentTypeData.name,
    leaveSegmentTypeData.color,
    leaveSegmentTypeData.description,
    leaveSegmentTypeData.created_at,
    leaveSegmentTypeData.updated_at
  );

  return leaveSegmentType;
}
export default leaveSegmentTypeFetchByIdUseCase;
