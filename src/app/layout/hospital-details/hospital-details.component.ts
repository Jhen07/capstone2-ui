import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Hospital, initHospital } from 'src/app/models/hospital.model';
import { DoctorService } from 'src/app/services/doctor/doctor.service';
import { Doctor } from 'src/app/models/doctor.model';

@Component({
  selector: 'app-hospital-details',
  templateUrl: './hospital-details.component.html',
  styleUrls: ['./hospital-details.component.scss']
})
export class HospitalDetailsComponent implements OnInit {
  userRole = localStorage.getItem('user_role');
  editing = false;
  hospital: Hospital = JSON.parse(JSON.stringify(initHospital));
  doctorList: Doctor[] = [];
  docIndex = [];
  serviceIndex = [];
  serviceList = ['hermatology', '2D echo', 'X-ray', 'Blood Chemistry', 'EKG', 'Dental X-ray', 'Ultrasound'];
  constructor(
    private route: ActivatedRoute,
    private hospitalService: HospitalService,
    private doctorService: DoctorService, ) {
    this.route.params.subscribe(params => {
      this.hospitalService.getHospitalById(params.id).subscribe((hospital: any) => {
        this.hospital = hospital;
        console.log('====================================');
        console.log(hospital);
        console.log('====================================');
        this.doctorService.getAllDoctors(0).subscribe(docs => {
          this.doctorList = docs;
          this.doctorList.forEach((contact, i) => {
            if (this.hospital.contact_doctors.some(doc => doc.id == contact.id)) {
              this.docIndex.push(i);
            }
          });
          this.serviceList.forEach((service, i) => {
            if (this.hospital.service_offer.some(serv => serv == service)) {
              this.serviceIndex.push(i);
            }
          });
        });
      });
    });

  }

  ngOnInit() {
  }

  save() {
    this.hospital.contact_doctors = [];
    this.hospital.service_offer = [];
    this.docIndex.forEach(i => {
      this.hospital.contact_doctors.push(this.doctorList[i]);
    });
    this.serviceIndex.forEach(i => {
      this.hospital.service_offer.push(this.serviceList[i]);
    });
    this.hospitalService.updateHospital(this.hospital).subscribe();
    this.editing = false;
  }

}
