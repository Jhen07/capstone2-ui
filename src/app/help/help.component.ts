import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { UsersService } from '../services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { Notification } from '../models/notification.model';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    animations: [routerTransition()]
})
export class HelpComponent implements OnInit {
    email = '';
    constructor(
        public router: Router,
        private userService: UsersService,
        private toastr: ToastrService,
    ) {
        localStorage.setItem('isLoggedin', 'false');
    }

    ngOnInit() { }

    sendHelp() {
        this.userService.getStaffByEmail(this.email).subscribe(user => {
            if (!user) {
                return this.toastr.warning('Email does not exist!');
            }

            const notif: Notification = {
                description: `${user.first_name} ${user.last_name} is requesting for new password!`,
                title: 'Password Request',
                isNew: 1,
                staff_id: user.id,
                staff_name: `${user.first_name} ${user.last_name}`,
                type: 'request',
                created_by: user.id,
                updated_by: user.id
            };

            this.userService.sendNotif(notif).subscribe(() => {
                this.toastr.success('Password reset request sent!');
                this.router.navigate(['/login']);
            });
        });
    }

}
