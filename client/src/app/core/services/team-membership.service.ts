import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { TeamMembership } from "../../models/teamMembership";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class TeamMembershipService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createTeamMembership(
    teamMembership: TeamMembership
  ): Observable<TeamMembership[]> {
    const url = `${this.apiUrl}/team-memberships/create`;
    const payload = {
      team_id: teamMembership.team_id,
      user_id: teamMembership.user_id,
    };
    return this.http.post<TeamMembership[]>(url, payload);
  }

  updateTeamMembership(
    teamMembership: TeamMembership
  ): Observable<TeamMembership> {
    const url = `${this.apiUrl}/team-memberships/${teamMembership.id}`;
    let payload = {
      team_id: teamMembership.team_id,
    };
    return this.http.put<TeamMembership>(url, payload);
  }

  getAllTeamMemberships(): Observable<TeamMembership[]> {
    const url = `${this.apiUrl}/team-memberships`;
    return this.http.get<TeamMembership[]>(url);
  }

  getTeamMembershipById(id: bigint): Observable<TeamMembership> {
    const url = `${this.apiUrl}/team-memberships/${id}`;
    return this.http.get<TeamMembership>(url);
  }

  getTeamMembershipsByTeamId(id: bigint): Observable<TeamMembership[]> {
    const url = `${this.apiUrl}/team-memberships/team/${id}`;
    return this.http.get<TeamMembership[]>(url);
  }

  getTeamMembershipsByUserId(id: bigint): Observable<TeamMembership> {
    const url = `${this.apiUrl}/team-memberships/user/${id}`;
    return this.http.get<TeamMembership>(url);
  }

  deleteTeamMembership(id: bigint): Observable<void> {
    const url = `${this.apiUrl}/team-memberships/${id}`;
    return this.http.delete<void>(url);
  }
}
