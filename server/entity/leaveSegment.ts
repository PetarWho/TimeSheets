class LeaveSegment {
  id: bigint;
  start_date: number;
  end_date: number;
  notes: string;
  user_id: bigint;
  leave_segment_type_id: bigint;
  created_at: number;
  updated_at: number;
  status: string;
  constructor(
    id: bigint,
    start_date: number,
    end_date: number,
    notes: string,
    user_id: bigint,
    leave_segment_type_id: bigint,
    created_at: number,
    updated_at: number,
    status: string
  ) {
    this.id = id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.notes = notes;
    this.user_id = user_id;
    this.leave_segment_type_id = leave_segment_type_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.status = status;
  }
}

export default LeaveSegment;
