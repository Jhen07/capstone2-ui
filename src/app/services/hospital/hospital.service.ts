import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Hospital } from 'src/app/models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  url = environment.api + '/hospitals';
  api = environment.api + '/archives-get-all-by-archive';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAllHospitals(isArchived) {
    return this.http.get<Hospital[]>(`${this.api}?table=hospitals&archived_value=${isArchived}`, { headers: this.reqHeader });
  }

  getHospitalById(id) {
    return this.http.get(`${this.url}/${id}`, { headers: this.reqHeader });
  }

  addHospital(data: Hospital) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }


  updateHospital(data: Hospital) {
    data.updated_by = Number(this.userId);
    return this.http.patch(`${this.url}/${data.id}`, data, { headers: this.reqHeader });
  }

  deleteHospital(id) {
    return new Promise(resolve => {
      this.http.delete(`${this.url}/${id}`, { headers: this.reqHeader }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err);
      });
    });
  }
}
