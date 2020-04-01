import { Component, OnInit } from '@angular/core';
import { EldersService } from 'src/app/services/elders/elders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Elders } from 'src/app/models/elders.model';
import { StaffService } from 'src/app/services/staff/staff.service';
import { User, initialUser, EmploymentHistory } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {
  userRole = localStorage.getItem('user_role');
  staff: User = JSON.parse(JSON.stringify((initialUser)));
  ehistory: EmploymentHistory[];
  tab = 0;
  elderList: Elders[] = [];
  staffList: User[] = [];
  userId = localStorage.getItem('user_id');
  name = '';
  email = '';
  role = '';
  category = '';
  date_hired = '';
  status = '';
  archived = '';
  rawStaffList: User[] = [];
  rawElderList: Elders[] = [];
  printList = [];
  alerts: Array<any> = [];
  order = 'asc';
  age = '';
  bed_no = '';
  date_aff = '';

  constructor(
    private elderService: EldersService,
    private userService: UsersService,
    public route: ActivatedRoute,
    public router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private staffService: StaffService,
  ) {
    this.elderService.getAllElders('elders', 1).subscribe((elders: Elders[]) => {
      this.elderList = elders;
      this.rawElderList = elders;
    });
    
    this.staffService.getAllUsers(1).subscribe((users: any) => {
      this.staffList = users;
      this.rawStaffList = users;
    });
  }

  getCategory(category) {
    const text = category == 0 ? 'Name' : 
    category == 1 ? 'Role' :
    category == 2 ? 'Email' :
    category == 3 ? 'Date Hired' : 'Status';
    return text;
  }

  getRole(role) {
    const text = role == 0 ? 'Admin' : role == 1 ? 'Medical Staff' : 'Staff';
    return text;
  }

  ngOnInit() {
  }

  async unarchive() {
    this.staff.archived = 0;
    this.userService.updateUser(this.staff, this.ehistory).then(() => {
      if (+localStorage.getItem('user_id') == this.staff.id) {
        localStorage.setItem('user_data', JSON.stringify(this.staff));
      }
      this.toastr.success('Data send to Archive Successfully!');
    }).catch(err => {
      this.toastr.error(err.message);
    });
  }

  async exportPdf(){
    this.printList = [];
    this.printList.push(['Name', 'User Role', 'Email', 'Date Hired', 'Status']);
    this.staffList.forEach(staff => {
      const staffPrintList = [];
      staffPrintList.push(staff['first_name'] + ' ' + staff['last_name']);
      staffPrintList.push(this.getRole(staff.role));
      staffPrintList.push(staff['email']);
      staffPrintList.push(staff['date_hired']);
      const statusValue = staff.status == 0 ? 'Full-time' : staff.status == 1 ? 'Part-time' : 'Resigned';
      staffPrintList.push(statusValue);
      
      this.printList.push(staffPrintList);
    });

    console.log(this.printList);

    // playground requires you to assign document definition to a variable called dd
      var docDefinition = {
        content: [
          {
            text: 'ADD-CHE',
            bold: true,
            fontSize: 20,
            alignment: 'center',
          },
          {
            text: 'K-40 Bagong Pag asa Subd. Brgy San Vicente Apalit Pampanga', alignment: 'center'
          },
          {
            text: '+639232715825', style: 'sub_header'
          },
          {
            table: {
              widths: ['*', '*', '*', '*', '*'],
              body: [ ... this.printList
              ]
            }
          }
        ],
        styles: {
          sub_header: {
            fontSize: 12,
            alignment: 'center',
            margin: [0, 0, 0, 10]
          },
          font_8:{
              fontSize: 8,
              color: '#1B4E75'
          }
    }
      }

      pdfMake.createPdf(docDefinition).open();
  }

  async exportElderPdf(){
    this.printList = [];
    this.printList.push(['Fullname', 'Age', 'Bed No.', 'Date of Admission', 'Status']);
    this.elderList.forEach(elder => {
      const elderPrintList = [];
      elderPrintList.push(elder['first_name'] + ' ' + elder['last_name']);
      elderPrintList.push(elder['age']);
      elderPrintList.push(elder['bed_no']);
      elderPrintList.push(elder['date_stay_in_orphanage']);
      const statusValue = elder.status == 0 ? 'Active' : elder.status == 1 ? 'Discharge' : 'Desease';
      elderPrintList.push(statusValue);
      
      this.printList.push(elderPrintList);
    });
    console.log(this.printList);

    // playground requires you to assign document definition to a variable called dd
      var docDefinition = {
        content: [
          {
            text: 'ADD-CHE',
            bold: true,
            fontSize: 20,
            alignment: 'center',
          },
          {
            text: 'K-40 Bagong Pag asa Subd. Brgy San Vicente Apalit Pampanga', alignment: 'center'
          },
          {
            text: '+639232715825', style: 'sub_header'
          },
          {
            table: {
              widths: ['*', '*', '*', '*', '*'],
              body: [ ... this.printList
              ]
            }
          }
        ],
        styles: {
          sub_header: {
            fontSize: 12,
            alignment: 'center',
            margin: [0, 0, 0, 10]
          },
          font_8:{
              fontSize: 8,
              color: '#1B4E75'
          }
    }
      }

      pdfMake.createPdf(docDefinition).open();
  }

  filter(value) {
    let elders = this.rawElderList;

    if (this.name != '') {
      console.log('name');
      elders = elders.filter(elder => {
        const name = `${elder.first_name} ${elder.last_name}`;
        if (name.includes(this.name)) {
          return true;
        }
        return false;
      });
    }

    if (this.age != '') {
      console.log('age');
      elders = elders.filter(elder => {
        const age = `${elder.age}`;
        if (age.includes(this.age)) {
          return true;
        }
        return false;
      });
    }

    if (this.bed_no != '') {
      console.log('bed');
      elders = elders.filter(elder => {
        const bed = `${elder.bed_no}`;
        if (bed.includes(this.bed_no)) {
          return true;
        }
        return false;
      });
    }

    if (this.date_aff != '') {
      console.log('date');
      elders = elders.filter(elder => {
        const dateAff = new Date(this.date_aff).getTime();
        const elderAff = new Date(elder.date_stay_in_orphanage).getTime();
        const date = `${elder.date_stay_in_orphanage}`;
        if (date.includes(this.date_aff)) {
          return true;
        }
        return false;
      });
    }

    if (this.status != '') {
      elders = elders.filter(elder => {
        if (+this.status == elder.status) {
          return true;
        }
        return false;
      });
    }

    console.log(elders);
    this.elderList = elders;
  }

  stafffilter() {
    let staff = this.rawStaffList;

    if (this.name != '') {
      staff = staff.filter(stff => {
        const name = `${stff.first_name} ${stff.last_name}`;
        if (name.includes(this.name)) {
          return true;
        }
        return false;
      });
    }

    if (this.role != '') {
      staff = staff.filter(stff => {
        if (+this.role == stff.role) {
          return true;
        }
        return false;
      });
    }

    if (this.email != '') {
      staff = staff.filter(stff => {
        const email = `${stff.email}`;
        if (email.includes(this.email)) {
          return true;
        }
        return false;
      });
    }

    if (this.date_hired != '') {
      console.log('date');
      staff = staff.filter(stff => {
        const dateAff = new Date(this.date_hired).getTime();
        const stffAff = new Date(stff.date_hired).getTime();
        const date = `${stff.date_hired}`;
        if (date.includes(this.date_hired)) {
          return true;
        }
        return false;
      });
    }

    if (this.status != '') {
      staff = staff.filter(stff => {

        if (+this.status == stff.status) {
          return true;
        }
        return false;
      });
    }

    console.log(staff);
    this.staffList = staff;
  }

}
