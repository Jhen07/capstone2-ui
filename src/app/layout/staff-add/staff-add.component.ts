import { Component, OnInit } from '@angular/core';
import { User, initialUser, EmploymentHistory, initialEHistory } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users/users.service';
import { environment } from 'src/environments/environment';
import { resolve } from 'url';

@Component({
  selector: 'app-staff-add',
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.scss']
})
export class StaffAddComponent implements OnInit {
  staff: User = JSON.parse(JSON.stringify(initialUser));
  ehistory: EmploymentHistory = JSON.parse(JSON.stringify(initialEHistory));
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  minLength: number;

  constructor(public router: Router, private toastr: ToastrService, private userService: UsersService) {
    this.staff.role = 2;
  }
  dateHired: any;
  bDate: any;
  sabbathDate: any;
  confirm = '';
  file: any;
  contact_no = '';

  ngOnInit() { }

  async addStaff() {

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

    if (this.staff.first_name.trim() == '') {
      return this.toastr.error('Please fillup the Firstname field');
    }

    if (this.staff.last_name.trim() == '') {
      return this.toastr.error('Please fillup the Surname field');
    }

    if (this.staff.email.trim() == '') {
      return this.toastr.error('Please fillup the Email Address field');
    }

    if (this.staff.password.length < this.minLength){
      return this.toastr.error('Password must be minimum of 8 character!');
    }

    if (this.staff.password.trim() == '') {
      return this.toastr.error('Please complete Password');
    } else {
      if (this.confirm.trim() == '') {
        return this.toastr.error('Please confirm Password');
      }
      if (this.staff.password != this.confirm) {
        return this.toastr.error('Password did not match!');
      }
    }
    if (this.fileData) {
      this.staff.image = await this.onSubmit() as string;
    }

    this.userService.addUser(this.staff).subscribe(async (data: any) => {
      this.ehistory.staff_id = data.id;
      await this.userService.addEmpolymentHistory(this.ehistory).toPromise();
      this.toastr.success('Success!');
      this.router.navigate(['/staff']);
    }, err => {
      this.toastr.error('Save Failed!');
    });

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

  fileUpload($event) {
    const data = {
      image: $event.target.files
    };
    this.userService.uploadImage({ image: data }).subscribe(res => {
    });
  }

}
