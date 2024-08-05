import WorkSegmentType from "../../entity/workSegmentType";
import { fetchWorkSegmentTypeById } from "../../adapters/repositories/workSegmentTypeRepository";

async function workSegmentTypeFetchByIdUseCase(
  workSegmentTypeId: bigint
): Promise<WorkSegmentType | null> {
  const workSegmentTypeData = await fetchWorkSegmentTypeById(workSegmentTypeId);

  if (workSegmentTypeData) {
    const workSegmentType = new WorkSegmentType(
      workSegmentTypeData.id,
      workSegmentTypeData.name,
      workSegmentTypeData.color,
      workSegmentTypeData.description,
      workSegmentTypeData.created_at,
      workSegmentTypeData.updated_at
    );
    return workSegmentType;
  } else {
    return null;
  }
}

export default workSegmentTypeFetchByIdUseCase;
