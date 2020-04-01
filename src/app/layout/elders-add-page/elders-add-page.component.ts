import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Elders, initialElder, MedicalHistory, initalMedHistory } from 'src/app/models/elders.model';
import { EldersService } from 'src/app/services/elders/elders.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-elders-add-page',
  templateUrl: './elders-add-page.component.html',
  styleUrls: ['./elders-add-page.component.scss']
})
export class EldersAddPageComponent implements OnInit {
  elder: Elders = JSON.parse(JSON.stringify(initialElder));
  bDate: any;
  dateIn: any;
  sabbath: any;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(public router: Router, private elderService: EldersService, private toastr: ToastrService, private userService: UsersService) {
  }

  ngOnInit() {
  }

  async addElder() {

    if (this.bDate) {
      const newDate = `${this.bDate.year}-${this.bDate.month}-${this.bDate.day}`;
      this.elder.birth_date = newDate;
    }

    if (this.dateIn) {
      const newDate = `${this.dateIn.year}-${this.dateIn.month}-${this.dateIn.day}`;
      this.elder.date_stay_in_orphanage = newDate;
    } else {
      return this.toastr.error('Please enter valid stay in date!');
    }

    if (this.sabbath) {
      const newDate = `${this.sabbath.year}-${this.sabbath.month}-${this.sabbath.day}`;
      this.elder.sabbath = newDate;
    }

    if (this.fileData) {
      this.elder.image = await this.onSubmit() as string;
    }

    this.elderService.addElder(this.elder).subscribe((data: Elders) => {
      this.toastr.success('Success!');
      this.clearAll();
      this.router.navigate(['/elders']);
    }, reject => {
      console.log(reject);

      this.toastr.warning(reject.error.message);
    });


  }

  clearAll() {
    this.bDate = null;
    this.dateIn = null;
    this.sabbath = null;
    this.elder = JSON.parse(JSON.stringify(initialElder));
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
}
