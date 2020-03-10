import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from 'src/app/services/task/task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task, TaskReport } from 'src/app/models/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  time: any;
  taskList: Task[] = [];
  doneTasks: TaskReport[] = [];
  userId = localStorage.getItem('user_id');
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  constructor(
    public router: Router,
    private userService: UsersService,
    private toastr: ToastrService,
    private taskService: TaskService,
    private modalService: NgbModal,
  ) {
    this.getAllTasks(this.userId);
    this.getReports();
  }

  ngOnInit() {
    this.setTime();
  }

  getReports() {
    this.taskService.getTaskReportById(this.userId).subscribe(reports => {
      this.doneTasks = reports.filter(report => {
        const date = new Date(report.date).toLocaleDateString();
        const today = new Date().toLocaleDateString();
        if (date == today) {
          return true;
        }
        return false;
      });
    });
  }

  async getAllTasks(id) {
    const today = new Date().getDay();
    const tasks = await this.taskService.getTaskByStaff(id).toPromise() as Task[];
    console.log(tasks);

    this.taskList = tasks.filter(task => {
      if (task.date_repeats.includes(this.weekdays[today])) {
        return true;
      }
      return false;
    });
  }

  setTime() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  getStatus(id) {
    if (this.doneTasks.some(task => task.task_id == id)) {
      return this.doneTasks.find(task => task.task_id == id).status;
    }
    return 'Pending';
  }

}
