import { LeaveSegmentStatus } from "../enums/leaveSegmentTypeStatus.enum";
import BaseQueryParams from "./baseQueryParams";

export default interface LeaveSegmentQueryParams extends BaseQueryParams {
  status?:
    | LeaveSegmentStatus.Approved
    | LeaveSegmentStatus.Awaiting
    | LeaveSegmentStatus.Denied;
  startDate?: string;
  endDate?: string;
  typeId?: number;
}
