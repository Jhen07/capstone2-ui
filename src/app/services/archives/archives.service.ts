import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Elders } from 'src/app/models/elders.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ArchivesService {

  url = environment.api + '/users';
  userId = +localStorage.getItem('user_id');
  api = environment.api + '/archives-get-all-by-archive';

  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
    console.log('====================================');
    console.log(this.userId);
    console.log('====================================');
  }

  getAllUsers(isArchived) {
    return this.http.get(`${this.api}?table=users&archived_value=${isArchived}`, { headers: this.reqHeader });
  }

}
