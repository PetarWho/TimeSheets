import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Client } from "../../models/client";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllClients(
    page: number,
    pageSize: number,
    search: string
  ): Observable<Client[]> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());
    if (search) {
      params = params.set("search", search);
    }

    const url = `${this.apiUrl}/clients`;
    return this.http.get<Client[]>(url, { params });
  }

  getClientById(id: bigint): Observable<Client> {
    const url = `${this.apiUrl}/clients/${id}`;
    return this.http.get<Client>(url);
  }
}
