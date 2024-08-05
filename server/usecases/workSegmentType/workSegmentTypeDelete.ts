import { deleteWorkSegmentType } from "../../adapters/repositories/workSegmentTypeRepository";

async function workSegmentTypeDeleteUseCase(
  workSegmentTypeId: bigint
): Promise<{ message: string }> {
  return await deleteWorkSegmentType(workSegmentTypeId);
}

export default workSegmentTypeDeleteUseCase;
