import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/api/api-config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = API;

  constructor(private http: HttpClient) { }

  create(data: any) {
    return this.http.post(`${this.api}/users`, data);
  }

  getById(id: string | number): Observable<any> {
    return this.http.get(`${this.api}/users/${id}`);
  }

  update(data: any, id: string): Observable<any> {
    return this.http.put(`${this.api}/users/${id}`, data);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.api}/users`);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${this.api}/users/${id}`);
  }

  createOrNotDefaultUser(): Observable<any> {
    return this.http.get(`${this.api}/createOrNotDefaultUser`);
  }

}
