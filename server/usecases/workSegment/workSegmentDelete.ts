import { deleteWorkSegment } from "../../adapters/repositories/workSegmentRepository";

async function workSegmentDeleteUseCase(
  workSegmentId: bigint
): Promise<{ message: string }> {
  return await deleteWorkSegment(workSegmentId);
}

export default workSegmentDeleteUseCase;
