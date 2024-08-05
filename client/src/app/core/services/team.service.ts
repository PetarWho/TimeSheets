import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Team } from "../../models/team";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { formatDateToYMD } from "../functions/dateFunctions";

@Injectable({
  providedIn: "root",
})
export class TeamService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllTeams(
    currentPage: number = 0,
    pageSize: number = 10,
    search: string = ""
  ): Observable<Team[]> {
    let params = new HttpParams()
      .set("page", currentPage.toString())
      .set("pageSize", pageSize.toString());
    if (search) {
      params = params.set("search", search);
    }
    return this.http.get<Team[]>(`${this.apiUrl}/teams`, { params });
  }

  getTeamById(id: bigint): Observable<Team> {
    const url = `${this.apiUrl}/teams/${id}`;
    return this.http.get<Team>(url);
  }

  getTeamsCount(
    dateRange: { startDate: Date; endDate: Date } | null
  ): Promise<number | undefined> {
    const url = `${this.apiUrl}/teams/count`;

    const params = new HttpParams()
      .set("startDate", dateRange ? formatDateToYMD(dateRange.startDate) : "")
      .set("endDate", dateRange ? formatDateToYMD(dateRange.endDate) : "");
    return this.http.get<number>(url, { params }).toPromise();
  }
  updateTeam(team: Team): Observable<Team> {
    const url = `${this.apiUrl}/teams/${team.id}`;
    return this.http.put<Team>(url, team);
  }
  deleteTeam(team: Team): Observable<Team> {
    const url = `${this.apiUrl}/teams/${team.id}`;
    return this.http.delete<Team>(url);
  }
}
