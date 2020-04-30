import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Notification } from 'src/app/models/notification.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Output() collapsedEvent = new EventEmitter<boolean>();
    public pushRightClass: string;
    collapsed: boolean;

    notifications: Notification[] = [];
    newCount = 0;
    time: any;
    constructor(private translate: TranslateService, public router: Router, private userService: UsersService) {

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
        this.getNotifs();

        {

            if (+localStorage.getItem('user_role') != 0) {
              this.router.navigate(['staff-dashboard']);
            }
        
            this.setTime();
          }
    }

    getNotifs() {
        this.userService.getAllNotifs().subscribe(notifs => {
            this.notifications = notifs.reverse();
            this.newCount = notifs.reduce((total, notif) => {
                if (notif.isNew == 1) {
                    return total + 1;
                }
                return total;
            }, 0);
        });
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
        this.collapsed = false;
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

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    readNotif() {
        this.notifications.forEach(notif => {
            notif.isNew = 0;
            this.userService.updateNotif(notif).subscribe();
        });
        this.newCount = 0;
    }

    setTime() {
        setInterval(() => {
          this.time = new Date();
        }, 1000);
      }
}
