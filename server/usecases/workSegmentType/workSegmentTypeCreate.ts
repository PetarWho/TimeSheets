import { createWorkSegmentType } from "../../adapters/repositories/workSegmentTypeRepository";
import WorkSegmentType from "../../entity/workSegmentType";

async function workSegmentTypeCreateUseCase(
  workSegmentTypeData: WorkSegmentType
): Promise<{ message: string }> {
  return await createWorkSegmentType(workSegmentTypeData);
}

export default workSegmentTypeCreateUseCase;
