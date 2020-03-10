import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { User, initialUser, EmpoymentHistory, initialEHistory } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Task, TaskReport } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task/task.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EldersService } from 'src/app/services/elders/elders.service';
import { Elders } from 'src/app/models/elders.model';
import { Medicine } from 'src/app/models/medicine.model';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.scss']
})
export class StaffDetailsComponent implements OnInit {
  userRole = localStorage.getItem('user_role');
  userId = localStorage.getItem('user_id');
  tab = 1;
  editing1 = false;
  editing2 = false;
  editing3 = false;
  dateHired: any;
  bDate: any;
  sabbathDate: any;
  taskList: Task[] = [];
  elderList: Elders[] = [];
  medList: Medicine[] = [];
  staff: User = JSON.parse(JSON.stringify((initialUser)));
  elderIndex = 0;
  medIndex = 0;
  quantity = 0;
  ehistory: EmpoymentHistory[];
  closeResult: string;
  time: any;
  addDate: any;
  alerts: Array<any> = [];
  confirmPassword = '';
  newPassword = '';
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  doneTasks: TaskReport[] = [];
  addEHistory: EmpoymentHistory = JSON.parse(JSON.stringify(initialEHistory));
  dateRepeats = [
    {
      day: 'Mon',
      isSelected: false,
    },
    {
      day: 'Tue',
      isSelected: false,
    },
    {
      day: 'Wed',
      isSelected: false,
    },
    {
      day: 'Thu',
      isSelected: false,
    },
    {
      day: 'Fri',
      isSelected: false,
    },
    {
      day: 'Sat',
      isSelected: false,
    },
    {
      day: 'Sun',
      isSelected: false,
    },
  ];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private userService: UsersService,
    private elderService: EldersService,
    private medService: MedicineService,
    private toastr: ToastrService,
    private taskService: TaskService,
    private modalService: NgbModal,
    public sanitizer: DomSanitizer
  ) {
    this.route.params.subscribe(async params => {
      if (!params.id) {
        this.router.navigate(['/staff']);
      }
      this.staff = await this.userService.getStaff(params.id).toPromise() as User;
      this.ehistory = await this.userService.getEhistoryByStaffId(this.staff.id).toPromise() as EmpoymentHistory[];
      this.elderList = await this.elderService.getAllElders('elders', 0).toPromise() as Elders[];
      this.medList = await this.medService.getAllMedicine(0).toPromise() as Medicine[];
      this.getAllTasks();
      this.initDates();
      this.getReports();
    });
  }

  async getAllTasks() {
    this.taskList = await this.taskService.getTaskByStaff(this.staff.id).toPromise() as Task[];
    console.log(this.taskList);
  }

  ngOnInit() {
  }

  initDates() {
    if (this.staff.date_hired) {
      const dates = this.staff.date_hired.split('-');
      this.dateHired = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
    if (this.staff.birth_date) {
      const dates = this.staff.birth_date.split('-');
      this.bDate = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
    if (this.staff.sabbath) {
      const dates = this.staff.sabbath.split('-');
      this.sabbathDate = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
  }

  async save() {
    this.editing1 = false;
    this.editing2 = false;
    if (this.bDate) {
      const newDate = `${this.bDate.year}-${this.bDate.month}-${this.bDate.day}`;
      this.staff.birth_date = newDate;
    }

    if (this.dateHired) {
      const newDate = `${this.dateHired.year}-${this.dateHired.month}-${this.dateHired.day}`;
      this.staff.date_hired = newDate;
    } else {
      return this.toastr.error('Please enter valid date hired!');
    }

    if (this.sabbathDate) {
      const newDate = `${this.sabbathDate.year}-${this.sabbathDate.month}-${this.sabbathDate.day}`;
      this.staff.sabbath = newDate;
    }

    if (this.staff.first_name.trim() == '' || this.staff.last_name.trim() == '' || this.staff.email.trim() == '') {
      return this.toastr.error('Please fillup required fields');
    }


    if (this.fileData) {
      this.staff.image = await this.onSubmit() as string;
    }

    this.userService.udpateUser(this.staff, this.ehistory).then(() => {
      if (+localStorage.getItem('user_id') == this.staff.id) {
        localStorage.setItem('user_data', JSON.stringify(this.staff));
      }
      this.toastr.success('Saved!');
    }).catch(err => {
      this.toastr.error(err.message);
    });
  }

  getReports() {
    this.taskService.getTaskReportById(this.staff.id).subscribe(reports => {
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


  async addTask() {
    if (!this.time) {
      return this.toastr.error('Please enter valid time!');
    }
    if (!this.dateRepeats.some(date => date.isSelected)) {
      return this.toastr.error('Please atleast 1 day for repeat!');
    }

    if (this.quantity <= 0) {
      return this.toastr.error('Please enter valid quantity!');
    }

    const dateRepeats = this.dateRepeats.filter(date => date.isSelected).map(date => date.day);

    console.log(this.medList[this.medIndex]);
    console.log(this.medList[this.medIndex].id);

    const newTask: Task = {
      elder_id: this.elderList[this.elderIndex].id,
      elder_name: `${this.elderList[this.elderIndex].first_name} ${this.elderList[this.elderIndex].last_name}`,
      time: `${this.time.hour}:${this.time.minute}`,
      medicine_id: this.medList[this.medIndex].id,
      date_repeats: dateRepeats,
      medicine_description: this.medList[this.medIndex].medicine_name,
      qty: this.quantity,
      task_owner_id: this.staff.id,
      task_description: `${this.staff.first_name} ${this.staff.first_name}`,
      status: 'Pending',
      date: new Date().toString()
    };

    this.taskService.addTask(newTask).toPromise().then(res => {
      this.toastr.success('Saved!');
      this.getAllTasks();
      this.close();
    }).catch(err => {
      this.toastr.error(err.message);
      this.close();
    });
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  addAlert(message) {
    const alert = {
      id: Math.random().toFixed(2),
      type: 'danger',
      message
    };
    this.alerts.push(alert);
    setTimeout(() => {
      this.alerts = this.alerts.filter(filter => filter.id != alert.id);
    }, 3000);
  }

  formatTime(timeString: string) {
    const today = new Date();

    today.setHours(+timeString.substring(0, 1));
    today.setMinutes(+timeString.substring(3, 4));
    return today;
  }

  clearModalFields() {
    this.medIndex = 0;
    this.elderIndex = 0;
    this.time = null;
    this.addDate = null;
    this.quantity = null;
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview 
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  onSubmit() {
    return new Promise(resolve => {
      const formData = new FormData();
      formData.append('image', this.fileData);
      this.userService.uploadImage(formData).subscribe((res: any) => {
        resolve(`http://localhost:8000/storage/images/${res.filePath.substring(14)}`);
      });
    });

  }

  addEmploymentHistory() {

    if (this.addEHistory.company.trim() == '' || this.addEHistory.position.trim() == '') {
      return this.toastr.warning('Please complete employment details');
    }
    this.addEHistory.staff_id = this.staff.id;
    this.userService.addEmpolymentHistory(this.addEHistory).subscribe(res => {
      this.ehistory.push(res);
      this.addEHistory = JSON.parse(JSON.stringify(initialEHistory));
      this.close();
    });
  }

  removeEGistory(i) {
    this.userService.deleteEHistory(this.ehistory[i].id).then(() => {
      this.ehistory.splice(i, 1);
    });
  }

  getStatus(id) {
    if (this.doneTasks.some(task => task.task_id == id)) {
      return this.doneTasks.find(task => task.task_id == id).status;
    }
    return 'Pending';
  }

  updatePassword() {

    if (this.newPassword.trim() == '' && this.confirmPassword.trim() == '') {
      return this.editing3 = !this.editing3;
    }

    if (this.newPassword.trim() !== this.confirmPassword.trim()) {
      return this.toastr.warning('Passwords did not match');
    }

    this.userService.updatePassword(this.staff.email, this.newPassword).then(() => {
      this.toastr.success('Password updated');
      this.editing3 = !this.editing3;
      this.newPassword = '';
      this.confirmPassword = '';
    }).catch(err => {
      this.editing3 = !this.editing3;
      this.toastr.error(err.message);
    });
  }
}
