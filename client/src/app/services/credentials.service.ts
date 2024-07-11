import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }

  public getAllCredentials(): Observable<any> {
    return this.http.get(this.baseUrl+'credentials/get/all');
  }

  public resetPassword(id: any): Observable<any> {
    return this.http.put(this.baseUrl+'credentials/reset/'+id,{});
  }

  public changePassword(email: any, data: any): Observable<any> {
    return this.http.put(this.baseUrl+'credentials/update/password/'+email,data);
  }
}
