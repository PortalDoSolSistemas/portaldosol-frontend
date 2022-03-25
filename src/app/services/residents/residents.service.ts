import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from 'src/app/api/api-config';

@Injectable({
  providedIn: 'root'
})
export class ResidentsService {
  private api = API;

  constructor(private http: HttpClient) { }

  create(data: any) {
    return this.http.post(`${this.api}/residents`, data);
  }

  get(params) {
    return this.http.get(`${this.api}/residents`, { params })
      .pipe(map(items => this.format(items)));
  }

  getById(id: string | number): Observable<any> {
    return this.http.get(`${this.api}/residents/${id}`);
  }

  update(data: any, id: string): Observable<any> {
    return this.http.put(`${this.api}/residents/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/residents/${id}`);
  }

  filter(term) {
    return this.http.get(`${this.api}/residents/filter/${term}`)
  }

  private format(list) {
    for (let item of list?.data) {
      if (item?.cpf) {
        item.cpf = item.cpf.replace(/[^\d]/g, '');
        item.cpf = item.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
      if (item?.cel) {
        item.cel = item.cel.replace(/[^\d]/g, '');
        item.cel = item.cel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    }
    return list;
  }

}
