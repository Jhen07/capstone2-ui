import { Component, OnInit } from '@angular/core';
import { Elders, initialElder, MedicalHistory, initalMedHistory } from 'src/app/models/elders.model';
import { Router, ActivatedRoute } from '@angular/router';
import { EldersService } from 'src/app/services/elders/elders.service';
import { ToastrService } from 'ngx-toastr';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersService } from 'src/app/services/users/users.service';
import { Doctor, initDoc } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor/doctor.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-elders-details',
  templateUrl: './elders-details.component.html',
  styleUrls: ['./elders-details.component.scss']
})
export class EldersDetailsComponent implements OnInit {
  elderID;
  tab = 1;
  illnessTab = 1;
  updating1 = false;
  updating2 = false;
  updating3 = false;
  dateIn: any;
  bDate: any;
  sabbathDate: any;

  elder: Elders = JSON.parse(JSON.stringify(initialElder));
  medHistory: MedicalHistory = JSON.parse(JSON.stringify(initalMedHistory));
  presentIllness: MedicalHistory[] = [];
  pastIllness: MedicalHistory[] = [];
  selectedDoctor: Doctor = JSON.parse(JSON.stringify(initDoc));

  takenMeds = [];
  doctorList: Doctor[] = [];
  archived = '';

  loading = true;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  category = '';

  docIndex = [];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private elderService: EldersService,
    private medService: MedicineService,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer,
    private userService: UsersService,
    private doctorService: DoctorService,
    private modalService: NgbModal
  ) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.elderID = params.id;
        this.init(this.elderID);

        this.doctorService.getAllDoctors(0).subscribe(doctors => {
          this.doctorList = doctors;
          if (doctors[0]) {
            this.selectedDoctor = doctors[0];
          }
        });

      } else {
        router.navigate(['/elders']);
      }
    });
  }

  init(id) {
    this.elderService.getElderById(id).subscribe((elder: any) => {
      this.elder = elder;
      this.elderService.getMedHistoryById(elder.id).subscribe((res: any[]) => {
        this.presentIllness = res.filter(data => data.type === 'present');
        this.pastIllness = res.filter(data => data.type === 'past');
      });
      this.medService.getTakenMedicine(this.elder.id).subscribe((med: any[]) => {
        this.takenMeds = med;
      });
      this.initDates();
      this.loading = false;
    });
  }
  
  ngOnInit() {
  }


  initDates() {
    if (this.elder.date_stay_in_orphanage) {
      const dates = this.elder.date_stay_in_orphanage.split('-');
      this.dateIn = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
    if (this.elder.birth_date) {
      const dates = this.elder.birth_date.split('-');
      this.bDate = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
    if (this.elder.sabbath) {
      const dates = this.elder.sabbath.split('-');
      this.sabbathDate = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
  }

  async save() {
    this.updating1 = false;
    this.updating2 = false;
  
    if (this.bDate) {
      const newDate = `${this.bDate.year}-${this.bDate.month}-${this.bDate.day}`;
      this.elder.birth_date = newDate;
    }

    if (this.dateIn) {
      const newDate = `${this.dateIn.year}-${this.dateIn.month}-${this.dateIn.day}`;
      this.elder.date_stay_in_orphanage = newDate;
    } else {
      return this.toastr.error('Please enter valid date hired!');
    }

    if (this.sabbathDate) {
      const newDate = `${this.sabbathDate.year}-${this.sabbathDate.month}-${this.sabbathDate.day}`;
      this.elder.sabbath = newDate;
    }

    if (this.elder.first_name.trim() == '' || this.elder.last_name.trim() == '') {
      return this.toastr.error('Please fill up required fields');
    }

    if (this.fileData) {
      this.elder.image = await this.onSubmit() as string;
    }

    this.elderService.updateElder(this.elder).subscribe(() => {
      this.toastr.success('Saved!');
    }, err => {
      this.toastr.error(err.message);
    });
  }

  saveMed() {
    this.updating3 = false;
    this.toastr.success('Saved!');
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  async unarchive() {
    this.elder.archived = 0;
    this.elderService.updateElder(this.elder).subscribe(() => {
      this.toastr.success('Successfully sent to Elder List!');
    }, err => {
      this.toastr.error(err.message);
    });
  }

  async archive() {
    this.elder.archived = 1;
    this.elderService.updateElder(this.elder).subscribe(() => {
      this.toastr.success('Successfully sent to Archive');
    }, err => {
      this.toastr.error(err.message);
    });
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

  close() {
    this.modalService.dismissAll();
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      console.log(
        `Closed with: ${result}`);
    }, (reason) => {
      console.log(
        `Dismissed ${this.getDismissReason(reason)}`);
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

  addMedHistory() {
    if (this.medHistory.illness.trim() == '' || this.medHistory.description.trim() == '') {
      return this.toastr.warning('Please input required fields');
    }

    if (this.medHistory.duration_to) {
      const newDate = `${this.medHistory.duration_to.month}-${this.medHistory.duration_to.day}-${this.medHistory.duration_to.year}`;
      this.medHistory.duration_to = new Date(newDate).toString();
    } else {
      return this.toastr.warning('Please input valid date');
    }

    if (this.medHistory.duration_from) {
      const newDate = `${this.medHistory.duration_from.year}-${this.medHistory.duration_from.month}-${this.medHistory.duration_from.day}`;
      this.medHistory.duration_from = new Date(newDate).toString();
    } else {
      return this.toastr.warning('Please input valid date');
    }

    this.medHistory.elder_id = this.elderID;

    if (this.selectedDoctor) {
      this.medHistory.assigned_doctor_id = this.selectedDoctor.id;
      this.medHistory.assigned_doctor_name = this.selectedDoctor.doc_name;
    }

    this.elderService.addMedicalHistory(this.medHistory).subscribe(med => {
      this.init(this.elderID);
      this.close();
      this.medHistory = JSON.parse(JSON.stringify(initalMedHistory));
    });

  }

  convertDate(date) {
    return new Date(date);
  }
  
}
