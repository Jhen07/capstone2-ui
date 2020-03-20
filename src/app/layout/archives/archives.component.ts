import { Component, OnInit } from '@angular/core';
import { EldersService } from 'src/app/services/elders/elders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Elders } from 'src/app/models/elders.model';
import { StaffService } from 'src/app/services/staff/staff.service';
import { User } from 'src/app/models/user.model';
import { GuestService } from 'src/app/services/guest/guest.service';
import { Guest } from 'src/app/models/guest.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task/task.service';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { Medicine } from 'src/app/models/medicine.model';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor/doctor.service';
import { Accomplishments } from 'src/app/models/accomplishments.model';
import { AccomplishmentsService } from 'src/app/services/accomplishments/accomplishments.service';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {
  userRole = localStorage.getItem('user_role');
  tab = 0;
  elderList: Elders[] = [];
  staffList: User[] = [];
  guestList: Guest[] = [];
  taskList: Task[] = [];
  medicineList: Medicine[] = [];
  hospitalList: Hospital[] = [];
  doctorList: Doctor[] = [];
  accList: Accomplishments[] = [];
  constructor(
    private elderService: EldersService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private staffService: StaffService,
    private guestService: GuestService,
    private medicineService: MedicineService,
    private taskService: TaskService,
    private hospitalService: HospitalService,
    private doctorService: DoctorService,
    private accompService: AccomplishmentsService,
  ) {
    this.elderService.getAllElders('elders', 1).subscribe((elders: Elders[]) => {
      this.elderList = elders;
    });
    this.staffService.getAllUsers(1).subscribe((users: any) => {
      this.staffList = users;
    });
    this.guestService.getAllGuests(1).subscribe((guests: Guest[]) => {
      this.guestList = guests;
    });
    this.staffService.getAllUsers(1).subscribe((users: any) => {
      this.staffList = users;
    });
    this.taskService.getAllTasks().subscribe((task: any) => {
      this.taskList = task;
    });
    this.medicineService.getAllMedicine(1).subscribe((list: Medicine[]) => {
      this.medicineList = list;
    });

    this.hospitalService.getAllHospitals(1).subscribe(hospitals => {
      this.hospitalList = hospitals.map(mapped => {
        const hospital = mapped;
        hospital.service_offer = JSON.parse(hospital.service_offer as any);
        return hospital;
      });
    });
    this.doctorService.getAllDoctors(1).subscribe(docs => {
      this.doctorList = docs;
    });
    this.accompService.getAllAccomplishments(1).subscribe(acc => {
      this.accList = acc.map(res => {
        res.submitted_by = JSON.parse(res.submitted_by);
        return res;
      });
    });
  }

  ngOnInit() {
  }

}
