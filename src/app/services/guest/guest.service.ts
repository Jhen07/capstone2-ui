import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Guest } from 'src/app/models/guest.model';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  url = environment.api + '/guests';
  api = environment.api + '/archives-get-all-by-archive';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
  }

  getAllGuests(isArchived) {
    return this.http.get(`${this.api}?table=guests&archived_value=${isArchived}`, { headers: this.reqHeader });
  }

  addGuest(data: Guest) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    data.updated_at = new Date().toLocaleString();
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }

  updateGuest(data: Guest) {
    data.updated_by = Number(this.userId);
    data.updated_at = new Date().toLocaleString();
    return this.http.patch(`${this.url}/${data.id}`, data, { headers: this.reqHeader });
  }

  deleteGuest(id) {
    return new Promise(resolve => {
      this.http.delete(`${this.url}/${id}`, { headers: this.reqHeader }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err);
      });
    });
  }
}
