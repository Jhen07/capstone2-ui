import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Doctor } from 'src/app/models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  url = environment.api + '/doctors';
  api = environment.api + '/archives-get-all-by-archive';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getDoctors() {
    return this.http.get<Doctor[]>(`${this.api}`, { headers: this.reqHeader });
  }

  getAllDoctors(isArchived) {
    return this.http.get<Doctor[]>(`${this.api}?table=doctors&archived_value=${isArchived}`, { headers: this.reqHeader });
  }

  getDoctorById(id) {
    return this.http.get(`${this.url}/${id}`, { headers: this.reqHeader });
  }

  addDoctor(data: Doctor) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }


  updateDoctor(data: Doctor) {
    data.updated_by = Number(this.userId);
    return this.http.patch(`${this.url}/${data.id}`, data, { headers: this.reqHeader });
  }

  deleteDoctor(id) {
    return new Promise(resolve => {
      this.http.delete(`${this.url}/${id}`, { headers: this.reqHeader }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err);
      });
    });
  }
}
