import { updateWorkSegmentType } from "../../adapters/repositories/workSegmentTypeRepository";
import WorkSegmentType from "../../entity/workSegmentType";

async function workSegmentTypeUpdateUseCase(
  workSegmentTypeId: bigint,
  updatedWorkSegmentTypeData: WorkSegmentType
): Promise<{ message: string }> {
  return await updateWorkSegmentType(
    workSegmentTypeId,
    updatedWorkSegmentTypeData
  );
}

export default workSegmentTypeUpdateUseCase;
