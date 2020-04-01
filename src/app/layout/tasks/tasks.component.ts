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
  rawTaskList: Task[] = [];
  doneTasks: TaskReport[] = [];
  userId = localStorage.getItem('user_id');
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  elder_name = '';

  constructor(
    public router: Router,
    private userService: UsersService,
    private toastr: ToastrService,
    private taskService: TaskService,
    private modalService: NgbModal,
  ) {
    this.getAllTasks(this.userId);
    this.getReports();

    this.taskService.getAllTasks().subscribe((task: any) => {
      this.rawTaskList = task;
    });
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
    // this.taskService.getAllTasks(0).subscribe((tasks: Task[]) => {
    //   this.rawTaskList = tasks;
    // });
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

  filter() {
    let tasks = this.rawTaskList;

    if (this.elder_name != '') {
      console.log('name');
      tasks = tasks.filter(task => {
        const elder_name = `${task.elder_name}`;
        if (elder_name.includes(this.elder_name)) {
          return true;
        }
        return false;
      });
    }

    console.log(tasks);

    this.taskList = tasks;
  }

  // filter() {
  //   let staff = this.rawStaffList;

  //   if (this.name != '') {
  //     staff = staff.filter(stff => {
  //       const name = `${stff.first_name} ${stff.last_name}`;
  //       if (name.includes(this.name)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }

  //   console.log(staff);

  //   this.staffList = staff;

  // }

}
