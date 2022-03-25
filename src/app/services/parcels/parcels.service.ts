import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from 'src/app/api/api-config';

@Injectable({
  providedIn: 'root'
})
export class ParcelsService {
  private api = API;

  constructor(private http: HttpClient) { }

  create(data: any) {
    return this.http.post(`${this.api}/parcels`, data);
  }

  get(params): Observable<any> {
    return this.http.get(`${this.api}/parcels`, { params })
      .pipe(map(items => this.format(items)));
  }

  getById(id: string | number): Observable<any> {
    return this.http.get(`${this.api}/parcels/${id}`);
  }

  update(data: any, id: string): Observable<any> {
    return this.http.put(`${this.api}/parcels/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/parcels/${id}`);
  }

  print(params): Observable<any> {
    return this.http.get(`${this.api}/print-parcels`, { params: params, responseType: 'blob' });
  }

  getByAddress(params): Observable<any> {
    return this.http.get(`${this.api}/getByAddress`, { params });
  }

  private format(list) {
    for (let item of list?.data) {
      if (item.date) {
        let d = item.date.split('T')[0].split('-');
        item.date = `${d[2]}/${d[1]}/${d[0]}`;
      }
      if (item.delivered_date) {
        let d = item.delivered_date.split('T')[0].split('-');
        item.delivered_date = `${d[2]}/${d[1]}/${d[0]}`;
      }
    }
    return list;
  }
}
