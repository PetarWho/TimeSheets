import LeaveSegment from "../leaveSegment";

export default interface LeaveSegmentDTO extends LeaveSegment {
  user_name: string;
  leave_segment_type_name: string;
}
