import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Elders } from 'src/app/models/elders.model';

@Injectable({
  providedIn: 'root'
})
export class EldersService {
  url = environment.api + '/elders';
  api = environment.api + '/archives-get-all-by-archive';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private http: HttpClient) { }

  getElders() {
    return this.http.get<any[]>(this.url, { headers: this.reqHeader });
  }

  getAllElders(table, isArchived) {
    return this.http.get(`${this.api}?table=elders&archived_value=${isArchived}`, { headers: this.reqHeader });
  }

  getElderById(id) {
    return this.http.get(`${this.url}/${id}`, { headers: this.reqHeader });
  }

  addElder(data: Elders) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    data.updated_at = new Date().toLocaleString();
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }

  getMedHistoryById(id) {
    return this.http.get(`${environment.api}/elders-medical-history?elder_id=${id}`, { headers: this.reqHeader });
  }

  getMedHistoryByType(id, type) {
    return this.http.get(`${environment.api}/elders-medical-history?elder_id=${id}&type=${type}`, { headers: this.reqHeader });
  }

  addMedicalHistory(data) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    return this.http.post(`${environment.api}/elders-medical-history`, data, { headers: this.reqHeader });
  }

  updateElder(data: Elders) {
    data.updated_by = Number(this.userId);
    return this.http.patch(`${this.url}/${data.id}`, data, { headers: this.reqHeader });
  }

  deleteElder(id) {
    return new Promise(resolve => {
      this.http.delete(`${this.url}/${id}`, { headers: this.reqHeader }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err);
      });
    });
  }

  updateMedicalHistory(data) {
    data.updated_by = Number(this.userId);
    return this.http.patch(`${environment.api}/elders-medical-history/${data.id}`, data, { headers: this.reqHeader });
  }
}
