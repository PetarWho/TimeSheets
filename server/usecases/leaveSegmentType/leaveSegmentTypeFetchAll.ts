import LeaveSegmentType from "../../entity/leaveSegmentType";
import { fetchAllLeaveSegmentTypes } from "../../adapters/repositories/leaveSegmentTypeRepository";
import BaseQueryParams from "../../ interfaces/baseQueryParams";

async function leaveSegmentTypeFetchAllUseCase(
  params: BaseQueryParams
): Promise<LeaveSegmentType[]> {
  const leaveSegmentTypesData: LeaveSegmentType[] =
    await fetchAllLeaveSegmentTypes(params);

  const leaveSegmentTypes = leaveSegmentTypesData.map(
    (leaveSegmentTypeData: LeaveSegmentType) =>
      new LeaveSegmentType(
        leaveSegmentTypeData.id,
        leaveSegmentTypeData.name,
        leaveSegmentTypeData.color,
        leaveSegmentTypeData.description,
        leaveSegmentTypeData.created_at,
        leaveSegmentTypeData.updated_at
      )
  );

  return leaveSegmentTypes;
}

export default leaveSegmentTypeFetchAllUseCase;
