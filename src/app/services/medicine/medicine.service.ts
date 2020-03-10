import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Medicine } from 'src/app/models/medicine.model';
import { MedReport } from 'src/app/models/med-report.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  url = environment.api + '/medicines';
  api = environment.api + '/archives-get-all-by-archive';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
    console.log('====================================');
    console.log(this.userId);
    console.log('====================================');
  }

  getMedicine(id) {
    return this.http.get<Medicine>(`${this.url}/${id}`, { headers: this.reqHeader });
  }

  getAllMedicine(isArchived) {
    return this.http.get(`${this.api}?table=medicines&archived_value=${isArchived}`, { headers: this.reqHeader });
  }

  getMedicineReports(isArchived) {
    return this.http.get<MedReport[]>(`${this.api}?table=medicine_reports&archived_value=${isArchived}`, { headers: this.reqHeader });
  }

  getTakenMedicine(elder_id) {
    return this.http.get(`${environment.api}/elders-taken-medicine?elder_id=${elder_id}`, { headers: this.reqHeader });
  }

  addMedicine(data, report) {
    this.addMedicineReport(report);
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }

  addMedicineReport(report) {
    this.http.post(`${environment.api}/medicine-reports`, report).subscribe();
  }

  updateMed(data: Medicine, report: MedReport) {
    data.updated_by = Number(this.userId);
    data.updated_at = new Date().toLocaleString();
    this.addMedicineReport(report);

    return this.http.patch(`${this.url}/${data.id}`, data, { headers: this.reqHeader });
  }

  deleteMed(id) {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.url}/${id}`, { headers: this.reqHeader }).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
}
