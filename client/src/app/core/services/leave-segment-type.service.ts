import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import LeaveSegmentType from "../../models/leaveSegmentType";

@Injectable({
  providedIn: "root",
})
export class LeaveSegmentTypeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLeaveSegmentTypes(
    page: number,
    pageSize: number,
    search: string | null
  ): Observable<LeaveSegmentType[]> {
    const url = `${this.apiUrl}/leave-segment-types`;
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());

    if (search) {
      params = params.set("search", search);
    }
    return this.http.get<LeaveSegmentType[]>(url, { params });
  }

  getLeaveSegmentTypeById(id: bigint): Observable<LeaveSegmentType> {
    const url = `${this.apiUrl}/leave-segment-types/${id}`;
    return this.http.get<LeaveSegmentType>(url);
  }
}
