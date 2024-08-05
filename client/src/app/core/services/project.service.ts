import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Project } from "../../models/project";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { formatDateToYMD } from "../functions/dateFunctions";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllProjects(
    currentPage: number = 0,
    pageSize: number = 10,
    search: string = ""
  ): Observable<Project[]> {
    let params = new HttpParams()
      .set("page", currentPage.toString())
      .set("pageSize", pageSize.toString());
    if (search) {
      params = params.set("search", search);
    }
    return this.http.get<Project[]>(`${this.apiUrl}/projects`, { params });
  }

  getProjectById(id: bigint): Observable<Project> {
    const url = `${this.apiUrl}/projects/${id}`;
    return this.http.get<Project>(url);
  }

  getProjectsCount(
    dateRange: { startDate: Date; endDate: Date } | null
  ): Promise<number | undefined> {
    const url = `${this.apiUrl}/projects/count`;
    const params = new HttpParams()
      .set("startDate", dateRange ? formatDateToYMD(dateRange.startDate) : "")
      .set("endDate", dateRange ? formatDateToYMD(dateRange.endDate) : "");
    return this.http.get<number>(url, { params }).toPromise();
  }

  updateProject(project: Project): Observable<Project> {
    const url = `${this.apiUrl}/projects/${project.id}`;
    let payload = {
      client_id: project.client_id,
      name: project.name,
    };
    return this.http.put<Project>(url, payload);
  }
  deleteProject(project: Project): Observable<Project> {
    const url = `${this.apiUrl}/projects/${project.id}`;
    return this.http.delete<Project>(url);
  }
  getProjectCount(): Promise<number | undefined> {
    const url = `${this.apiUrl}/projects/count`;
    return this.http.get<number>(url).toPromise();
  }
}
