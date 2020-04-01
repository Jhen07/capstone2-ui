import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Hospital, initHospital } from 'src/app/models/hospital.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor/doctor.service';
import { Doctor } from 'src/app/models/doctor.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styleUrls: ['./hospitals.component.scss']
})
export class HospitalsComponent implements OnInit {
  userRole = localStorage.getItem('user_role');
  rawHospitalList: Hospital[] = [];
  hospitalList: Hospital[] = [];
  hospital: Hospital;
  loading = true;
  printList = [];
  closeResult: string;
  doctorList: Doctor[] = [];
  docIndex = [];
  serviceIndex = [];
  serviceList = ['hermatology', '2D echo', 'X-ray', 'Blood Chemistry', 'EKG', 'Dental X-ray', 'Ultrasound'];
  order = 'asc';

  hospital_name = '';
  address = '';
  hospital_contact_no = '';
  service_offer = '';

  category = '';

  constructor(
    private hospitalService: HospitalService,
    private doctorService: DoctorService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.setHospitals();
    this.hospitalService.getAllHospitals('hospital').subscribe((hospital: Hospital[]) => {
      this.hospitalList = hospital;
      this.rawHospitalList = hospital;
    });
  }

  ngOnInit() {
  }

  setHospitals() {
    this.hospitalService.getAllHospitals(0).subscribe(hospitals => {
      this.hospitalList = hospitals.map(mapped => {
        const hospital = mapped;
        hospital.service_offer = JSON.parse(hospital.service_offer as any);
        return hospital;
      });
      console.log('====================================');
      console.log(this.hospitalList);
      console.log('====================================');
      this.hospital = JSON.parse(JSON.stringify(initHospital));
    });
    this.doctorService.getAllDoctors(0).subscribe(docs => {
      this.doctorList = docs;
    });
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getCategory(category) {
    const text = category == 0 ? 'Name' : 
    category == 1 ? 'Address' :
    category == 2 ? 'Contact Number' : 'Service Offer';
    return text;
  }

  close() {
    this.modalService.dismissAll();
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

  async addHospital() {
    if (this.hospital.hospital_name.trim() == '') {
      return this.toastr.error('Please enter hospital name!');
    }

    this.docIndex.forEach(i => {
      this.hospital.contact_doctors.push(this.doctorList[i]);
    });

    this.serviceIndex.forEach(i => {
      this.hospital.service_offer.push(this.serviceList[i]);
    });

    await this.hospitalService.addHospital(this.hospital).toPromise();
    this.setHospitals();
    this.close();
  }

  filter(value) {
    let hospitals = this.rawHospitalList;

    if (this.hospital_name != '') {
      console.log('hospital_name');

      hospitals = hospitals.filter(hospital => {
        const hospital_name = `${hospital.hospital_name}`;
        if (hospital_name.includes(this.hospital_name)) {
          return true;
        }
        return false;
      });
    }

    if (this.address != '') {
      console.log('address');

      hospitals = hospitals.filter(hospital => {
        const address = `${hospital.address}`;
        if (address.includes(this.address)) {
          return true;
        }
        return false;
      });
    }

    if (this.hospital_contact_no != '') {
      console.log('hospital_contact_no');

      hospitals = hospitals.filter(hospital => {
        const hospital_contact_no = `${hospital.hospital_contact_no}`;
        if (hospital_contact_no.includes(this.hospital_contact_no)) {
          return true;
        }
        return false;
      });
    }

    if (this.service_offer != '') {
      console.log('service_offer');

      hospitals = hospitals.filter(hospital => {
        const service_offer = `${hospital.service_offer}`;
        if (service_offer.includes(this.service_offer)) {
          return true;
        }
        return false;
      });
    }

    console.log(hospitals);

    this.hospitalList = hospitals;

  }

  sort(column) {
    console.log(column);

    if (this.order == 'desc') {

      this.order = 'asc';
      this.hospitalList = this.hospitalList.sort((a, b) => {
        if (a[column] > b[column]) {
          return -1;
        }
        if (b[column] > a[column]) {
          return 1;
        }
        return 0;
      });
    } else {
      this.order = 'desc';
      this.hospitalList = this.hospitalList.sort((a, b) => {
        if (a[column] < b[column]) {
          return -1;
        }
        if (b[column] > a[column]) {
          return 1;
        }
        return 0;
      });
    }

  }
  async exportPdf() {
    this.printList = [];
    this.printList.push(['Name', 'Address', 'Contact Number', 'Service Offer']);
    this.hospitalList.forEach(hospital => {
      const hospitalPrintList = [];
      hospitalPrintList.push(hospital['hospital_name']);
      hospitalPrintList.push(hospital['address']);
      hospitalPrintList.push(hospital['hospital_contact_no']);
      hospitalPrintList.push(hospital['service_offer']);

      this.printList.push(hospitalPrintList);
    });

    console.log(this.printList);

    // playground requires you to assign document definition to a variable called dd
    var docDefinition = {
      content: [
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [... this.printList]
          }
        }
      ],
      styles: {
        font_8: {
          fontSize: 8,
          color: '#1B4E75'
        }
      }
    }

    pdfMake.createPdf(docDefinition).open();
  }
}
