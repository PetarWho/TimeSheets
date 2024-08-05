import { createWorkSegment } from "../../adapters/repositories/workSegmentRepository";
import WorkSegment from "../../entity/workSegment";

async function workSegmentCreateUseCase(
  workSegmentData: WorkSegment
): Promise<{ message: string }> {
  return await createWorkSegment(workSegmentData);
}

export default workSegmentCreateUseCase;
