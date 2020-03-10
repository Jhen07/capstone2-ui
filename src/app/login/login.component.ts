import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { UsersService } from '../services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { Userlogs } from '../models/use-logs.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    email = '';
    password = '';
    constructor(
        public router: Router,
        private userService: UsersService,
        private toastr: ToastrService,
    ) {
        // localStorage.setItem('isLoggedin', 'false');
    }

    ngOnInit() { }

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'true');
        const logs: Userlogs = {
            action: 'Log in',
            archived: 0,
            created_by: 0,
            name: 'Juan Dela Cruz',
            role: 0,
            time: new Date().toString(),
            updated_by: 0
        };

        if (this.email == 'admin' && this.password == 'admin') {
            localStorage.setItem('user_id', '0');
            localStorage.setItem('user_role', '0');
            this.router.navigate(['/dashboard']);
            this.toastr.success('Welcome Admin!');
            this.userService.addUserLog(logs).subscribe();
        } else {
            this.userService.login({ email: this.email, password: this.password }).subscribe((res: any) => {
                if (res.data) {
                    localStorage.setItem('user_id', res.data.id);
                    localStorage.setItem('user_role', res.data.role);
                    localStorage.setItem('user_data', JSON.stringify(res.data));

                    logs.updated_by = res.data.id;
                    logs.created_by = res.data.id;
                    logs.role = res.data.role;
                    logs.name = `${res.data.first_name} ${res.data.last_name}`;
                    this.userService.addUserLog(logs).subscribe();
                    this.toastr.success(res.message);
                    this.router.navigate(['/dashboard']);
                }
            }, get => {
                this.toastr.error(get.error.message);
            });
        }

    }
}
