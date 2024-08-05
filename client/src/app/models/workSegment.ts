export default interface WorkSegment {
  id: bigint;
  date: Date;
  hours: number;
  notes: string;
  project_id: bigint;
  user_id: bigint;
  work_segment_type_id: bigint;
}
