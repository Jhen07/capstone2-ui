import { Component, OnInit } from '@angular/core';
import { Medicine } from 'src/app/models/medicine.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { medicines } from 'src/app/Datas/medicines.data';
import { ToastrService } from 'ngx-toastr';
import { MedReport } from 'src/app/models/med-report.model';
import { User } from 'src/app/models/user.model';
import { log } from 'util';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-medicine-inventory',
  templateUrl: './medicine-inventory.component.html',
  styleUrls: ['./medicine-inventory.component.scss']
})
export class MedicineInventoryComponent implements OnInit {
  userId = +localStorage.getItem('user_id');
  userData: User = JSON.parse(localStorage.getItem('user_data'));
  medicineList: Medicine[] = [];
  printList = [];
  rawMedicineList: Medicine[] = [];
  medName = '';
  quantity = 1;
  buffer = 1;
  dateExpire: any;
  alerts: Array<any> = [];
  closeResult: string;
  medicines = medicines;
  selectedType = 0;
  restock = 1;
  med: Medicine;
  medToUpdate: any;
  operation = '+';
  restockType = 'qty';
  order = 'asc';

  medicine_name = '';
  type_of_medicine_description = '';
  qty = '';
  dispense = '';
  updated_at = '';
  buff = '';

  constructor(
    private modalService: NgbModal,
    private medicineService: MedicineService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.medName = medicines[0].list[0].name;
    this.getAllMedicines();
  }

  closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
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

  async getAllMedicines() {
    this.medicineService.getAllMedicine(0).subscribe((list: Medicine[]) => {
      this.medicineList = list;
      console.log('====================================');
      console.log(list);
      console.log('====================================');
    });
    this.medicineService.getAllMedicine(0).subscribe((med: Medicine[]) => {
      this.rawMedicineList = med;
    });
  }

  addMedicine() {

    if (this.medName.trim() == '') {
      return this.addAlert('Please enter medicine name!');
    }

    if (this.quantity < 1 || this.quantity == null) {
      return this.addAlert('Please enter valid quantity!');
    }


    // if (this.dateExpire) {
    //   const newDate = `${this.dateExpire.year}-${this.dateExpire.month}-${this.dateExpire.day}`;
    //   this.dateExpire = newDate;
    // } else {
    //   return this.addAlert('Please enter valid Expiration Date!');
    // }


    const newMed: Medicine = {
      created_by: this.userId,
      updated_by: this.userId,
      expiration_date: this.dateExpire,
      medicine_name: this.medName,
      qty: this.quantity,
      dispense: 0,
      buffer: this.buffer,
      type_of_medicine_description: this.medicines[this.selectedType].category,
      type_of_medicine_id: this.medicines[this.selectedType].id,
    };

    const report: MedReport = {
      action: this.operation == '+' ? 'Restock' : 'Dispense',
      created_by: this.userId,
      medicine_name: this.medName,
      medicine_type: this.medicines[this.selectedType].category,
      quantity: this.quantity,
      remaining_stock: this.quantity,
      staff: [this.userId, `${this.userData.first_name} ${this.userData.last_name}`],
      updated_by: this.userId,
    };


    console.log(report, 'here')
    this.medicineService.addMedicine(newMed, report).subscribe(med => {
      console.log(med);
      this.getAllMedicines();
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

  clearModalFields() {
    this.medName = medicines[0].list[0].name;
    this.dateExpire = '';
    this.quantity = 1;
  }

  openRestock(content, med, operation) {
    this.med = med;
    this.operation = operation;
    this.open(content);
  }

  restockMedicine() {
    if (this.restock <= 0) {
      return this.toastr.warning('Please input valid quantity!');
    }

    // if (this.operation == '+') {
    //   this.med.qty += this.restock;
    // } else {
    //   if (this.restock > this.med.qty) {
    //     return this.toastr.warning('The entered quantity is more than stock quantity!');
    //   } else {
    //     this.med.qty -= this.restock;
    //   }
    // }

    this.med[this.restockType] += this.restock;
    this.updateMedicine(this.med);
  }

  setUpdateMed(content, med: Medicine) {
    this.medToUpdate = med;
    this.selectedType = medicines.findIndex(obj => obj.id == med.type_of_medicine_id);
    this.open(content);
  }

  updateMedicine(med) {
    const report: MedReport = {
      action: this.operation == '+' ? 'Restock' : 'Dispense',
      created_by: this.userId,
      medicine_name: med.medicine_name,
      medicine_type: med.type_of_medicine_description,
      quantity: this.restock,
      remaining_stock: med.qty,
      staff: [this.userId, `${this.userData.first_name} ${this.userData.last_name}`],
      updated_by: this.userId,
    };

    this.medicineService.updateMed(med, report).subscribe(res => {
      this.close();
      this.restock = 1;
      this.toastr.success('Item restocked!');
    }, (err) => this.toastr.error(err.message));
  }


  async exportPdf() {
    this.printList = [];
    this.printList.push(['Medicine Name', 'Medicine Type', 'Buffer', 'Stock', 'Dispense', 'Date Modified']);
    this.medicineList.forEach(medicine => {
      const medicinePrintList = [];
      medicinePrintList.push(medicine['medicine_name']);
      medicinePrintList.push(medicine['type_of_medicine_description']);
      medicinePrintList.push(medicine['buffer']);
      medicinePrintList.push(medicine['qty']);
      medicinePrintList.push(medicine['dispense']);
      medicinePrintList.push(medicine['updated_at']);

      this.printList.push(medicinePrintList);
    });

    // playground requires you to assign document definition to a variable called dd
    var docDefinition = {
      content: [
        {
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [... this.printList
            ]
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


  filter(value) {
    let medicine = this.rawMedicineList;

    if (this.medicine_name != '') {
      console.log('medicine_name');
      medicine = medicine.filter(med => {
        const name = `${med.medicine_name}`;
        if (name.includes(this.medicine_name)) {
          return true;
        }
        return false;
      });
    }

    if (this.type_of_medicine_description != '') {
      console.log('type_of_medicine_description');
      medicine = medicine.filter(med => {
        const type_of_medicine_description = `${med.type_of_medicine_description}`;
        if (type_of_medicine_description.includes(this.type_of_medicine_description)) {
          return true;
        }
        return false;
      });
    }

    if (this.buff != '') {
      console.log('buffer');
      medicine = medicine.filter(med => {
        const buffer = `${med.buffer}`;
        if (buffer.includes(this.buff)) {
          return true;
        }
        return false;
      });
    }

    console.log(medicine);

    this.medicineList = medicine;

  }

  sort(column) {
    console.log(column);

    if (this.order == 'desc') {

      this.order = 'asc';
      this.medicineList = this.medicineList.sort((a, b) => {
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
      this.medicineList = this.medicineList.sort((a, b) => {
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
}
