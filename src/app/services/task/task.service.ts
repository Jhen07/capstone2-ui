import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { Task, TaskReport } from 'src/app/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  url = environment.api + '/tasks';
  api = environment.api + '/archives-get-all-by-archive';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
    console.log('====================================');
    console.log(this.userId);
    console.log('====================================');
  }

  getAllTasks(isArchived) {
    return this.http.get(`${this.api}?table=tasks&archived_value=${isArchived}`, { headers: this.reqHeader });
  }

  getTaskByStaff(id) {
    return this.http.get(`${this.url}?task_owner_id=${id}`, { headers: this.reqHeader });
  }

  addTask(data: Task) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }

  updateTask(data: Task) {
    data.updated_by = Number(this.userId);
    data.updated_at = new Date().toLocaleString();
    return this.http.patch(`${this.url}/${data.id}`, data, { headers: this.reqHeader });
  }

  getTaskReports() {
    return this.http.get<TaskReport[]>(`${environment.api}/tasks-reports`, { headers: this.reqHeader });
  }

  getTaskReportsByUser(id) {
    return this.http.get<TaskReport[]>(`${environment.api}/tasks-reports?id=${id}`, { headers: this.reqHeader });
  }

  addTaskReport(data: any) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    data.created_at = new Date();
    data.updated_at = new Date();
    return this.http.post(`${environment.api}/tasks-reports`, data, { headers: this.reqHeader });
  }

  getTaskReportById(id) {
    return this.http.get<TaskReport[]>(`${environment.api}/tasks-reports?task_owner_id=${id}`, { headers: this.reqHeader });
  }
}
