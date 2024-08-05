import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import WorkSegment from "../../models/workSegment";
import { convertUnixToDate, formatDateToYMD } from "../functions/dateFunctions";
import moment from "moment";

@Injectable({
  providedIn: "root",
})
export class WorkSegmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWorkSegments(
    page: number,
    pageSize: number,
    workSegmentTypeId: bigint | undefined = undefined,
    selectedDateRange: { startDate: Date; endDate: Date } | null
  ): Observable<WorkSegment[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString())
      .set("typeId", workSegmentTypeId ? workSegmentTypeId.toString() : "")
      .set(
        "startDate",
        selectedDateRange ? formatDateToYMD(selectedDateRange.startDate) : ""
      )
      .set(
        "endDate",
        selectedDateRange ? formatDateToYMD(selectedDateRange.endDate) : ""
      );

    const url = `${this.apiUrl}/work-segments`;
    return this.http.get<WorkSegment[]>(url, { params });
  }

  getWorkSegmentsByUserId(
    userId: number,
    page: number,
    pageSize: number
  ): Observable<WorkSegment[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());
    const url = `${this.apiUrl}/work-segments/user/${userId}`;
    return this.http.get<WorkSegment[]>(url, { params });
  }

  getWorkSegmentsCount(
    typeId: bigint | undefined,
    dateRange: { startDate: Date; endDate: Date } | null
  ): Promise<number | undefined> {
    const url = `${this.apiUrl}/work-segments/count`;

    const params = new HttpParams()
      .set("typeId", typeId ? typeId.toString() : "")
      .set("startDate", dateRange ? formatDateToYMD(dateRange.startDate) : "")
      .set("endDate", dateRange ? formatDateToYMD(dateRange.endDate) : "");
    return this.http.get<number>(url, { params }).toPromise();
  }

  createWorkSegment(workSegment: WorkSegment): Observable<WorkSegment> {
    const url = `${this.apiUrl}/work-segments/create`;

    let payload = {
      date: convertUnixToDate(workSegment.date),
      hours: workSegment.hours,
      notes: workSegment.notes,
      user_id: workSegment.user_id,
      work_segment_type_id: workSegment.work_segment_type_id,
      project_id: workSegment.project_id,
    };

    return this.http.post<WorkSegment>(url, payload);
  }

  updateWorkSegment(workSegment: WorkSegment): Observable<WorkSegment> {
    const url = `${this.apiUrl}/work-segments/${workSegment.id}`;

    workSegment.date = convertUnixToDate(workSegment.date);

    let payload = {
      date: workSegment.date,
      hours: workSegment.hours,
      notes: workSegment.notes,
      project_id: workSegment.project_id,
      user_id: workSegment.user_id,
      work_segment_type_id: workSegment.work_segment_type_id,
    };

    return this.http.put<WorkSegment>(url, payload);
  }

  deleteWorkSegment(workSegment: WorkSegment): Observable<WorkSegment> {
    return this.http.delete<WorkSegment>(
      `${this.apiUrl}/work-segments/${workSegment.id}`
    );
  }
}
