import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import LeaveSegment from "../../models/leaveSegment";
import { convertUnixToDate, formatDateToYMD } from "../functions/dateFunctions";

@Injectable({
  providedIn: "root",
})
export class LeaveSegmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLeaveSegments(
    page: number,
    pageSize: number,
    leaveSegmentTypeId: bigint | undefined = undefined,
    selectedDateRange: { startDate: Date; endDate: Date } | null
  ): Observable<LeaveSegment[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString())
      .set("typeId", leaveSegmentTypeId ? leaveSegmentTypeId.toString() : "")
      .set(
        "startDate",
        selectedDateRange ? formatDateToYMD(selectedDateRange.startDate) : ""
      )
      .set(
        "endDate",
        selectedDateRange ? formatDateToYMD(selectedDateRange.endDate) : ""
      );

    const url = `${this.apiUrl}/leave-segments`;
    return this.http.get<LeaveSegment[]>(url, { params });
  }

  getLeaveSegmentsByUserId(
    userId: number,
    page: number,
    pageSize: number
  ): Observable<LeaveSegment[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());
    const url = `${this.apiUrl}/leave-segments/user/${userId}`;
    return this.http.get<LeaveSegment[]>(url, { params });
  }

  getLeaveSegmentsCount(
    typeId: bigint | undefined,
    dateRange: { startDate: Date; endDate: Date } | null
  ): Promise<number | undefined> {
    const url = `${this.apiUrl}/leave-segments/count`;

    const params = new HttpParams()
      .set("typeId", typeId ? typeId.toString() : "")
      .set("startDate", dateRange ? formatDateToYMD(dateRange.startDate) : "")
      .set("endDate", dateRange ? formatDateToYMD(dateRange.endDate) : "");
    return this.http.get<number>(url, { params }).toPromise();
  }

  createLeaveSegment(leaveSegment: LeaveSegment): Observable<LeaveSegment> {
    const url = `${this.apiUrl}/leave-segments/create`;

    let payload = {
      start_date: convertUnixToDate(leaveSegment.start_date),
      end_date: convertUnixToDate(leaveSegment.end_date),
      notes: leaveSegment.notes,
      user_id: leaveSegment.user_id,
      leave_segment_type_id: leaveSegment.leave_segment_type_id,
    };

    return this.http.post<LeaveSegment>(url, payload);
  }

  updateLeaveSegment(leaveSegment: LeaveSegment): Observable<LeaveSegment> {
    const url = `${this.apiUrl}/leave-segments/${leaveSegment.id}`;

    leaveSegment.start_date = convertUnixToDate(leaveSegment.start_date);
    leaveSegment.end_date = convertUnixToDate(leaveSegment.end_date);

    let payload = {
      start_date: leaveSegment.start_date,
      end_date: leaveSegment.end_date,
      notes: leaveSegment.notes,
      user_id: leaveSegment.user_id,
      leave_segment_type_id: leaveSegment.leave_segment_type_id,
    };

    return this.http.put<LeaveSegment>(url, payload);
  }

  deleteLeaveSegment(leaveSegment: LeaveSegment): Observable<LeaveSegment> {
    return this.http.delete<LeaveSegment>(
      `${this.apiUrl}/leave-segments/${leaveSegment.id}`
    );
  }
}
