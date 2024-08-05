class WorkSegment {
  id: bigint;
  date: number;
  hours: number;
  notes: string;
  project_id: bigint;
  user_id: bigint;
  work_segment_type_id: bigint;
  created_at: number;
  updated_at: number;

  constructor(
    id: bigint,
    date: number,
    hours: number,
    notes: string,
    project_id: bigint,
    user_id: bigint,
    work_segment_type_id: bigint,
    created_at: number,
    updated_at: number
  ) {
    this.id = id;
    this.date = date;
    this.hours = hours;
    this.notes = notes;
    this.project_id = project_id;
    this.user_id = user_id;
    this.work_segment_type_id = work_segment_type_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default WorkSegment;
