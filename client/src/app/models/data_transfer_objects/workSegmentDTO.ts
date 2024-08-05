import WorkSegment from "../workSegment";

export default interface workSegmentDTO extends WorkSegment {
  user_name: string;
  project_name: string;
  work_segment_type_name: string;
}
