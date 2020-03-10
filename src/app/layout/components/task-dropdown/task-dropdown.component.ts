import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from 'src/app/services/task/task.service';
import { Task, TaskReport } from 'src/app/models/task.model';
import { ToastrService } from 'ngx-toastr';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { Medicine } from 'src/app/models/medicine.model';
import { MedReport } from 'src/app/models/med-report.model';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users/users.service';
import { Notification } from 'src/app/models/notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-dropdown',
  templateUrl: './task-dropdown.component.html',
  styleUrls: ['./task-dropdown.component.scss']
})
export class TaskDropdownComponent implements OnInit {
  @Input() task: Task;
  @Output() getReports = new EventEmitter<void>();

  userData: User = JSON.parse(localStorage.getItem('user_data'));
  med: Medicine;
  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private medService: MedicineService,
    private userService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.medService.getMedicine(this.task.medicine_id).subscribe(med => {
      this.med = med;
    });
  }

  updateTask(action) {
    this.task.status = action;
    // this.taskService.updateTask(this.task).subscribe(() => {
    //   this.toastr.success('Status updated!');
    // });

    if (this.med.qty > this.task.qty) {
      this.med.qty = this.med.qty - this.task.qty;
    } else {
      const remainder = this.task.qty - this.med.qty;
      this.med.qty = 0;
      this.med.buffer = this.med.buffer - remainder;
    }

    this.med.dispense += this.task.qty;

    if (this.med.qty < 10) {
      this.sendHelp(this.med);
    }

    const medReport: MedReport = {
      action: 'dispense',
      created_by: this.task.task_owner_id,
      medicine_name: this.med.medicine_name,
      medicine_type: this.med.type_of_medicine_description,
      quantity: this.task.qty,
      remaining_stock: this.med.qty,
      staff: [this.task.task_owner_id, `${this.userData.first_name} ${this.userData.last_name}`],
      updated_by: this.userData.id,
    };



    const taskReport: TaskReport = {
      task_id: this.task.id,
      date: new Date().toLocaleString(),
      elder_id: this.task.elder_id,
      elder_name: this.task.elder_name,
      medicine_description: this.task.medicine_description,
      medicine_id: this.task.medicine_id,
      staff_id: this.task.task_owner_id,
      staff_name: `${this.userData.first_name} ${this.userData.last_name}`,
      qty: this.task.qty,
      status: action,
      task_description: this.task.task_description,
      time: this.task.time,
    };

    this.taskService.addTaskReport(taskReport).subscribe();
    this.medService.updateMed(this.med, medReport).subscribe(med => {
      this.toastr.success('Status updated!');
      this.getReports.emit();
    });
  }

  sendHelp(med: Medicine) {
    const notif: Notification = {
      description: med.qty == 0 ? `${med.medicine_name} is out of stock!` : `${med.medicine_name} is almost out of stock!`,
      title: 'Medicine Stock',
      isNew: 1,
      staff_id: this.userData.id,
      staff_name: `${this.userData.first_name} ${this.userData.last_name}`,
      type: 'request',
      created_by: this.userData.id,
      updated_by: this.userData.id
    };

    this.userService.sendNotif(notif).subscribe(() => {
      this.toastr.success('Medicine stock notification sent!');
    });
  }

}
