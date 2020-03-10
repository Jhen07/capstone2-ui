import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Accomplishments } from 'src/app/models/accomplishments.model';

@Injectable({
  providedIn: 'root'
})
export class AccomplishmentsService {
  url = environment.api + '/accomplishments';
  api = environment.api + '/archives-get-all-by-archive';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
  }

  getAllAccomplishments(isArchived) {
    return this.http.get<Accomplishments[]>(`${this.api}?table=accomplishments&archived_value=${isArchived}`, { headers: this.reqHeader });
  }

  addAccomplishments(data: Accomplishments) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    data.updated_at = new Date().toLocaleString();
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }

  updateAccomplishments(data: Accomplishments) {
    data.updated_by = Number(this.userId);
    data.updated_at = new Date().toLocaleString();
    return this.http.patch(`${this.url}/${data.id}`, data, { headers: this.reqHeader });
  }

  deleteAccomplishments(id) {
    return new Promise(resolve => {
      this.http.delete(`${this.url}/${id}`, { headers: this.reqHeader }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err);
      });
    });
  }
}
