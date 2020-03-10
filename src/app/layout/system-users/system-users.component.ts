import { Component, OnInit } from '@angular/core';
import { Userlogs } from 'src/app/models/use-logs.model';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.scss']
})
export class SystemUsersComponent implements OnInit {
  userLogs: Userlogs[] = [];
  constructor(private userService: UsersService) {
    this.userService.getUserLogs().subscribe(logs => {
      this.userLogs = logs;
    });
  }

  ngOnInit() {
  }

  toDate(date) {
    return new Date(date);
  }

}
