import WorkSegment from "../../entity/workSegment";
import { fetchWorkSegmentById } from "../../adapters/repositories/workSegmentRepository";

async function workSegmentFetchByIdUseCase(
  workSegmentTypeId: bigint
): Promise<WorkSegment | null> {
  const workSegmentData = await fetchWorkSegmentById(workSegmentTypeId);

  if (workSegmentData) {
    const workSegment = new WorkSegment(
      workSegmentData.id,
      workSegmentData.date,
      workSegmentData.hours,
      workSegmentData.notes,
      workSegmentData.project_id,
      workSegmentData.user_id,
      workSegmentData.work_segment_type_id,
      workSegmentData.created_at,
      workSegmentData.updated_at
    );
    return workSegment;
  } else {
    return null;
  }
}

export default workSegmentFetchByIdUseCase;
