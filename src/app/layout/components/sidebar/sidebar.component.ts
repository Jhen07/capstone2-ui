import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/services/users/users.service';
import { User, initialUser } from 'src/app/models/user.model';
import { Userlogs } from 'src/app/models/use-logs.model';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    user: User = JSON.parse(JSON.stringify(initialUser));
    userId = 0;
    userRole = 0;
    isActive: boolean;
    showMenu: string;
    pushRightClass: string;

    @Output() collapsedEvent = new EventEmitter<boolean>();
    @Input() collapsed: boolean;

    constructor(private translate: TranslateService, public router: Router, private userService: UsersService) {
        this.userId = +localStorage.getItem('user_id');
        this.userRole = +localStorage.getItem('user_role');
        if (this.userId > 0) {
            this.userService.getStaff(this.userId).subscribe(user => {
                this.user = user;
            });
        } else {
            this.user.nick_name = 'Admin';
            this.user.first_name = 'Juan';
            this.user.last_name = 'Dela Cruz';
            console.log('====================================');
            console.log(this.user);
            console.log('====================================');
        }
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
    }


    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        const logs: Userlogs = {
            action: 'Log out',
            archived: 0,
            created_by: this.user.id,
            name: `${this.user.first_name} ${this.user.last_name}`,
            role: this.userRole,
            time: new Date().toString(),
            updated_by: this.user.id
        };

        console.log('====================================');
        console.log('Logoout');
        console.log('====================================');
        this.userService.addUserLog(logs).subscribe(logs => {
            localStorage.removeItem('isLoggedin');
            this.router.navigate(['/login']);
        });

    }
}
