import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import WorkSegmentType from "../../models/workSegmentType";

@Injectable({
  providedIn: "root",
})
export class WorkSegmentTypeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWorkSegmentTypes(
    page: number,
    pageSize: number,
    search: string | null
  ): Observable<WorkSegmentType[]> {
    const url = `${this.apiUrl}/work-segment-types`;
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());

    if (search) {
      params = params.set("search", search);
    }
    return this.http.get<WorkSegmentType[]>(url, { params });
  }

  getWorkSegmentTypeById(id: bigint): Observable<WorkSegmentType> {
    const url = `${this.apiUrl}/work-segment-types/${id}`;
    return this.http.get<WorkSegmentType>(url);
  }
}
