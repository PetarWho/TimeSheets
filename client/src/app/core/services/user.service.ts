import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import User from "../../models/user";
import { Role } from "../../models/role";
import { AuthService } from "./auth.service";
import { jwtDecode } from "jwt-decode";
import { UserStatus } from "../../models/enums/user-status.enum";
import { JwtToken } from "../../models/jwtToken";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }
  getUsers(
    page: number,
    pageSize: number,
    status: UserStatus,
    search: string | null
  ): Observable<User[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());

    if (status && status !== UserStatus.All) {
      params = params.set("status", status);
    }
    if (search) {
      params = params.set("search", search);
    }

    return this.http.get<User[]>(`${this.apiUrl}/users`, { params });
  }
  getUserById(id: bigint): Observable<User> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.get<User>(url);
  }

  async getUserEmail(): Promise<string> {
    let user = await this.getUserById(
      BigInt(this.getUserIdFromToken())
    ).toPromise();

    if (!user) {
      throw new Error("Invalid user");
    }

    return user.email;
  }

  getUserIdFromToken(): number {
    return this.authService.decodeToken().id;
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/users/${user.id}`;
    return this.http.put<User>(url, user);
  }

  updateRole(id: string, roleId: string): Observable<User> {
    const url = `${this.apiUrl}/users/set_role`;
    const headers = new HttpHeaders({
      "Referrer-Policy": "no-referrer",
    });
    const body = { id, roleId };
    return this.http.put<User>(url, body, { headers });
  }

  deactivateUser(id: bigint, deactivated: boolean): Observable<User> {
    const url = `${this.apiUrl}/users/deactivate/${id}`;
    const headers = new HttpHeaders({
      "Referrer-Policy": "no-referrer",
    });
    const body = { id, deactivated };

    return this.http.put<User>(url, body, { headers });
  }

  deleteUser(user: User): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/users/${user.id}`);
  }

  getNonTeamMembers(teamId: bigint): Observable<User[]> {
    const url = `${this.apiUrl}/non-team-members/${teamId}`;
    return this.http.get<User[]>(url);
  }

  getUsersCount(): Promise<number | undefined> {
    const url = `${this.apiUrl}/users/count`;
    return this.http.get<number>(url).toPromise();
  }
}
