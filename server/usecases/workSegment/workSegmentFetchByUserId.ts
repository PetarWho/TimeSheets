import WorkSegment from "../../entity/workSegment";
import { fetchWorkSegmentsByUserId } from "../../adapters/repositories/workSegmentRepository";
import CalendarQueryParams from "../../ interfaces/calendarQueryParams";

async function workSegmentFetchByUserIdUseCase(
  userId: bigint,
  params: CalendarQueryParams
): Promise<WorkSegment[]> {
  const userWorkSegments: WorkSegment[] = await fetchWorkSegmentsByUserId(
    userId,
    params
  );
  const workSegment = userWorkSegments.map(
    (workSegmentData: WorkSegment) =>
      new WorkSegment(
        workSegmentData.id,
        workSegmentData.date,
        workSegmentData.hours,
        workSegmentData.notes,
        workSegmentData.project_id,
        workSegmentData.user_id,
        workSegmentData.work_segment_type_id,
        workSegmentData.created_at,
        workSegmentData.updated_at
      )
  );
  return workSegment;
}

export default workSegmentFetchByUserIdUseCase;
