import { Component, OnInit } from '@angular/core';
import { GuestService } from 'src/app/services/guest/guest.service';
import { Guest, initialGuests } from 'src/app/models/guest.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EldersService } from 'src/app/services/elders/elders.service';
import { Elders } from 'src/app/models/elders.model';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-guess-monitoring',
  templateUrl: './guest-monitoring.component.html',
  styleUrls: ['./guest-monitoring.component.scss']
})
export class GuestMonitoringComponent implements OnInit {
  elderList: Elders[] = [];
  guestList: Guest[] = [];
  selectedElder = 1;
  selectedGuest: Guest = JSON.parse(JSON.stringify(initialGuests));
  printList = [];
  rawguestList: Guest[] = [];
  closeResult: string;
  alerts: Array<any> = [];
  time_in: any;
  time_in2: any;
  time_out: any;
  time_out2: any;
  deleteId = 0;

  // filter variables
  index = '';
  name = '';
  contact = '';
  address = '';
  visited = '';
  relationship = '';
  order = 'asc';
  in = '';
  out = '';
  created_at = '';

  guest: Guest = JSON.parse(JSON.stringify(initialGuests));

  constructor(
    private guestService: GuestService,
    private elderService: EldersService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.guestService.getAllGuests(0).subscribe((guests: Guest[]) => {
      this.guestList = guests;
      this.rawguestList = guests;
    });

    this.elderService.getAllElders('elders', 0).subscribe((elders: any[]) => {
      this.elderList = elders;

      if (elders.length) {
        this.selectedElder = elders[0].id;
      }

    });
  }


  open(content) {
    if (this.elderList.length == 0) {
      return this.toastr.warning('No elder to visit. Please add Elder to visit first!');
    }

    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openSm(content) {
    this.modalService.open(content, { size: 'sm' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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


  addGuest() {

    if (this.guest.guest_name.trim() == '') {
      return this.addAlert('Please enter guest name!');
    }

    this.guest.time_in = new Date().toString();
    this.guest.elder_id = this.selectedElder;
    const elder = this.elderList.find(data => data.id == this.selectedElder);
    this.guest.elder_name = `${elder.first_name} ${elder.last_name}`;
    this.guestService.addGuest(this.guest).subscribe(async (res: any) => {
      this.guestList = await this.guestService.getAllGuests(0).toPromise() as Guest[];
      this.toastr.success('Guest added!');
    });

    this.clearModalFields();
    this.close();

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
    return new Date(timeString);
  }

  clearModalFields() {
    this.guest = JSON.parse(JSON.stringify(initialGuests));
    this.time_in = null;
    this.time_out = null;
  }

  setSelectedGuest(guest: Guest, content) {
    this.selectedGuest = JSON.parse(JSON.stringify(guest));
    if (guest.time_in) {
      this.time_in2 = {
        hour: +guest.time_in.substring(0, 1),
        minute: +guest.time_in.substring(3, 4)
      };
    }
    if (guest.time_out) {
      this.time_out2 = {
        hour: +guest.time_out.substring(0, 1),
        minute: +guest.time_out.substring(3, 4)
      };
    }
    this.selectedElder = this.selectedGuest.elder_id;
    this.open(content);
  }

  setGuestToDelete(id, content) {
    this.deleteId = id;
    this.openSm(content);
  }

  updateGuest() {
    this.selectedGuest.elder_id = this.selectedElder;
    const elder = this.elderList.find(data => data.id == this.selectedElder);
    this.selectedGuest.elder_name = `${elder.first_name} ${elder.last_name}`;

    this.guestService.updateGuest(this.selectedGuest).subscribe(async (res: any) => {
      const i = this.guestList.findIndex(x => x.id == res.id);
      this.guestList = await this.guestService.getAllGuests(0).toPromise() as Guest[];
      this.toastr.success('Guest updated!');
    });

    this.clearModalFields();
    this.close();
  }

  async deleteGuest() {
    await this.guestService.deleteGuest(this.deleteId);
    this.guestList = await this.guestService.getAllGuests(0).toPromise() as Guest[];
    this.toastr.success('Record deleted!');
    this.close();
  }

  timeOut(i) {
    this.guestList[i].time_out = new Date().toString();
    this.guestService.updateGuest(this.guestList[i]).subscribe(async (res: any) => {
      this.guestList = await this.guestService.getAllGuests(0).toPromise() as Guest[];
      this.toastr.success('Guest updated!');
    });
  }

  filter() {
    let guest = this.rawguestList;

    if (this.index != '') {
      guest = guest[this.index];
    }

    if (this.name != '') {
      guest = guest.filter(gs => {
        if (gs.guest_name.includes(this.name)) {
          return true;
        }
        return false;
      });
    }

    if (this.contact != '') {
      guest = guest.filter(gs => {
        if (gs.contact_no.includes(this.contact)) {

          return true;
        }
        return false;
      });
    }

    if (this.address != '') {
      guest = guest.filter(gs => {
        if (gs.address.includes(this.address)) {
          return true;
        }
        return false;
      });
    }

    if (this.created_at != '') {
      console.log('created_at');
      guest = guest.filter(gs => {
        const created_at = `${gs.created_at}`;
        if (created_at.includes(this.created_at)) {
          return true;
        }
        return false;
      });
    }

    if (this.visited != '') {
      guest = guest.filter(gs => {

        if (gs.elder_name.includes(this.visited)) {
          return true;
        }
        return false;
      });
    }


    if (this.relationship != '') {
      guest = guest.filter(gs => {
        if (gs.relationship_description.toLowerCase().includes(this.relationship.toLowerCase())) {
          return true;
        }
        return false;
      });
    }

    this.guestList = guest;

  }

  sort(column) {
    console.log(column);

    if (this.order == 'desc') {

      this.order = 'asc';
      this.guestList = this.guestList.sort((a, b) => {
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
      this.guestList = this.guestList.sort((a, b) => {
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
    this.printList.push(['Guest Name', 'Contact No.', 'Address', 'Elders Visited', 'Relationship', 'Time-in', 'Time-out', 'Date']);
    this.guestList.forEach(gs => {
      const guestPrintList = [];
      guestPrintList.push(gs['guest_name']);
      guestPrintList.push(gs['contact_no']);
      guestPrintList.push(gs['address']);
      guestPrintList.push(gs['elder_name']);
      guestPrintList.push(gs['relationship_description']);
      guestPrintList.push(gs['time_in']);
      guestPrintList.push(gs['time_out']);
      guestPrintList.push(gs['created_at']);
      
      this.printList.push(guestPrintList);
    });
    console.log(this.printList);

    // playground requires you to assign document definition to a variable called dd
      var docDefinition = {
        pageOrientation: 'landscape',
        pageSize: 'LETTER',
        content: [
          // {
          //   image: await
          //   this.getBase64ImageFromURL(
          //     "https://images.pexels.com/photos/209640/pexels-photo-209640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300"
          //   )
          // },      
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
              widths: ['*', '*', '*', '*','*', '*', '*', '*'],
              body: [ ... this.printList
              ]
            }
          }],
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

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

}
