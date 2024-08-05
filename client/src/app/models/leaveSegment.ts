export default interface LeaveSegment {
  id: bigint;
  start_date: Date;
  end_date: Date;
  notes: string;
  user_id: bigint;
  leave_segment_type_id: bigint;
}
