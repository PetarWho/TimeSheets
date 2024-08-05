import { updateWorkSegment } from "../../adapters/repositories/workSegmentRepository";
import WorkSegment from "../../entity/workSegment";

async function workSegmentUpdateUseCase(
  workSegmentId: bigint,
  updatedWorkSegmentData: WorkSegment
): Promise<{ message: string }> {
  return await updateWorkSegment(workSegmentId, updatedWorkSegmentData);
}

export default workSegmentUpdateUseCase;
