import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Medicine } from 'src/app/models/medicine.model';
import { Router } from '@angular/router';
import { NotesService } from 'src/app/services/notes/notes.service';
import { Notes } from 'src/app/models/notes.model';
import { ToastrService } from 'ngx-toastr';
import { EventsService } from 'src/app/services/events/events.service';
import { EldersService } from 'src/app/services/elders/elders.service';
import { GuestService } from 'src/app/services/guest/guest.service';
import { UsersService } from 'src/app/services/users/users.service';
import { AnnouncementService, initAnnounce } from 'src/app/models/announcement.model';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  animations: [routerTransition()]
})

export class MainDashboardComponent implements OnInit {
  medicineList: Medicine[] = [];
  announcementList: Event[] = [];
  eventList: Event[] = [];
  notesList: Notes[] = [];
  notes = '';
  medName = '';
  quantity = 1;
  dateCreated: any;
  event = '';
  time: any;
  dateEvent: any;
  noteChecbox = false;
  date = '';

  staffCount: number;
  elderCount: number;
  guestCount: number;

  // calendar variables
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent; // the #calendar in the template

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: any[] = [
    { title: 'Today', start: new Date() }
  ];

  closeResult: string;
  alerts: Array<any> = [];
  dateSelected: EventInput;

  constructor(
    private modalService: NgbModal,
    public router: Router,
    private noteService: NotesService,
    private toastr: ToastrService,
    private eventService: EventsService,
    private elderService: EldersService,
    private guestService: GuestService,
    private userService: UsersService
  ) {

    if (+localStorage.getItem('user_role') != 0) {
      this.router.navigate(['staff-dashboard']);
    }

    this.elderService.getElders().subscribe(elders => {
      this.elderCount = elders.length;
    });

    this.userService.getAllUsers().subscribe((users: any[]) => {
      this.staffCount = users.length;
    });

    this.guestService.getAllGuests(0).subscribe((guests: any[]) => {
      this.guestCount = guests.length;
    });

    this.getAllEvents();
    this.getAllAnnouncements();
    this.getAllNotes();
  }

  ngOnInit() {
  }

  getAllNotes() {
    this.noteService.getAllnotes().subscribe(notes => {
      this.notesList = notes.reverse();
    });
  }

  getAllEvents() {
    this.eventService.getAllevent().subscribe(events => {
      this.eventList = events;
      this.calendarEvents = events;
    });
  }

  getAllAnnouncements() {
    this.eventService.getAllAnnouncements().subscribe(events => {
      this.announcementList = events.reverse();
    });
  }

  closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }

  addCalendarEvent() {
    if (!this.dateSelected.title || this.dateSelected.title.trim() == '') {
      return;
    }
    const event: EventInput = {
      title: this.dateSelected.title,
      time: this.dateSelected.time,
      start: this.dateSelected.date,
      allDay: this.dateSelected.allDay,
    };
    this.eventService.addEvent(event).subscribe();
    // this.calendarEvents = this.calendarEvents.concat(event);
    this.getAllEvents();
    this.close();
  }

  addAnouncementEvent() {
    let newDate;

    if (this.event.trim() === '') {
      return;
    }

    if (!this.time) {
      return this.toastr.error('Please enter valid time!');
    }

    if (this.dateEvent) {
      newDate = new Date(`${this.dateEvent.year}-${this.dateEvent.month}-${this.dateEvent.day}`).toISOString();
    } else {
      return this.toastr.warning('Please select date of the event!');
    }

    const event: EventInput = {
      title: this.event,
      time: `${this.time.hour}:${this.time.minute}`,
      start: newDate,
      allDay: true,
      type: 'announcement',
    };

    this.eventService.addEvent(event).subscribe();
    // this.calendarEvents = this.calendarEvents.concat(event);
    setTimeout(() => {
      this.getAllEvents();
      this.getAllAnnouncements();
    }, 300);
    this.close();
    this.event = '';
    this.dateEvent = null;
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
    this.medName = '';
    this.dateCreated = '';
    this.quantity = 1;
    this.time = null;
  }

  addNotes() {
    if (this.notes.trim() == '') {
      return;
    }

    const newNotes: Notes = {
      text: this.notes,
    };

    this.noteService.addnote(newNotes).subscribe(() => {
      this.getAllNotes();
      this.close();
      this.notes = '';
    });
  }

  selectAllNotes(value) {
    this.notesList.forEach(note => {
      note.isChecked = this.noteChecbox;
    });
  }

  deleteNotes() {
    if (this.notesList.some(note => note.isChecked)) {
      this.notesList.forEach(async note => {
        if (note.isChecked) {
          await this.noteService.deleteNote(note.id);
        }
      });
      this.toastr.success('Notes Deleted!');
      setTimeout(() => {
        this.getAllNotes();
      }, 300);

    } else {
      this.toastr.warning('No notes selected');
    }
  }

  deleteAnnouncement() {
    if (this.announcementList.some((event: any) => event.isChecked)) {
      this.announcementList.forEach(async (event: any) => {
        if (event.isChecked) {
          await this.eventService.deleteEvent(event.id);
        }
      });
      this.toastr.success('Event Deleted!');
      setTimeout(() => {
        this.getAllAnnouncements();
      }, 200);

    } else {
      this.toastr.warning('No announment selected!');
    }
  }

  convertDate(date) {
    return new Date(date);
  }
}
