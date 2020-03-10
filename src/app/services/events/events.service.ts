import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  url = environment.api + '/event';
  userId = +localStorage.getItem('user_id');
  api = environment.api + '/archives-get-all-by-archive';

  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }

  getAllevent() {
    return this.http.get<Event[]>(this.url, { headers: this.reqHeader });
  }

  getAllAnnouncements() {
    return this.http.get<Event[]>(`${this.url}?type=announcement`, { headers: this.reqHeader });
  }

  addEvent(data: any) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    data.updated_at = new Date().toLocaleString();
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }

  deleteEvent(id) {
    return new Promise(resolve => {
      this.http.delete(`${this.url}/${id}`, { headers: this.reqHeader }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err);
      });
    });
  }
}
