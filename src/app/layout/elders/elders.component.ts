import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EldersService } from 'src/app/services/elders/elders.service';
import { Elders, initialElder } from 'src/app/models/elders.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-elders',
  templateUrl: './elders.component.html',
  styleUrls: ['./elders.component.scss']
})
export class EldersComponent implements OnInit {
  rawElderList: Elders[] = [];
  elderList: Elders[] = [];
  printList = [];
  userId = 0;
  order = 'asc';

  name = '';
  age = '';
  bed_no = '';
  date_aff = '';
  status = '';

  constructor(
    public router: Router,
    private elderService: EldersService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    this.elderService.getAllElders('elders', 0).subscribe((elders: Elders[]) => {
      this.elderList = elders;
      this.rawElderList = elders;
    });
  }

  ngOnInit() {
  }

  async open(content, id) {
    this.userId = id;
    await this.modalService.open(content, { size: 'sm' }).result;
  }

  deleteElder() {
    this.elderService.deleteElder(this.userId).then(async () => {
      this.toastr.success('Record deleted!');
      this.elderList = await this.elderService.getAllElders('elders', 0).toPromise() as Elders[];
      this.close();
    }).catch(err => {
    });

  }

  close() {
    this.modalService.dismissAll();
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

    console.log(elders);

    this.elderList = elders;

  }

  sort(column) {
    console.log(column);

    if (this.order == 'desc') {

      this.order = 'asc';
      this.elderList = this.elderList.sort((a, b) => {
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
      this.elderList = this.elderList.sort((a, b) => {
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

  async exportPdf(){
    this.printList = [];
    this.printList.push(['Fullname', 'Age', 'Bed No.', 'Date Affiliated']);
    this.elderList.forEach(elder => {
      const elderPrintList = [];
      elderPrintList.push(elder['first_name'] + ' ' + elder['last_name']);
      elderPrintList.push(elder['age']);
      elderPrintList.push(elder['bed_no']);
      elderPrintList.push(elder['date_stay_in_orphanage']);
      
      this.printList.push(elderPrintList);
    });
    console.log(this.printList);

    // playground requires you to assign document definition to a variable called dd
      var docDefinition = {
        content: [
          {
            table: {
              widths: ['*', '*', '*', '*'],
              body: [ ... this.printList
              ]
            }
          }
        ],
        styles: {
          font_8:{
              fontSize: 8,
              color: '#1B4E75'
          }
    }
      }

      pdfMake.createPdf(docDefinition).open();
  }

}
