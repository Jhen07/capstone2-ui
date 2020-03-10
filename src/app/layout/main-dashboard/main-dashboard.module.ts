import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../bs-component/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MainDashboardComponent } from './main-dashboard.component';

@NgModule({
  declarations: [ModalComponent, BrowserModule, FormsModule],
  imports: [
    CommonModule, NgbModule, FormsModule, MainDashboardComponent
  ]
})
export class MainDashboardModule { }
