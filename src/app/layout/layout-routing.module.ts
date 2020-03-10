import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { EldersComponent } from './elders/elders.component';
import { StaffComponent } from './staff/staff.component';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { ReportsComponent } from './reports/reports.component';
import { MedicineInventoryComponent } from './medicine-inventory/medicine-inventory.component';
import { GuestMonitoringComponent } from './guest-monitoring/guest-monitoring.component';
import { SystemUsersComponent } from './system-users/system-users.component';
import { ArchivesComponent } from './archives/archives.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { EldersDetailsComponent } from './elders-details/elders-details.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';
import { HospitalDetailsComponent } from './hospital-details/hospital-details.component';
import { EldersAddPageComponent } from './elders-add-page/elders-add-page.component';
import { StaffAddComponent } from './staff-add/staff-add.component';
import { AuthGuard } from '../guards/auth.guard';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix', canActivate: [AuthGuard] },
            { path: 'main', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
            { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
            { path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
            { path: 'bs-element', loadChildren: () => import('./bs-element/bs-element.module').then(m => m.BsElementModule) },
            { path: 'grid', loadChildren: () => import('./grid/grid.module').then(m => m.GridModule) },
            { path: 'components', loadChildren: () => import('./bs-component/bs-component.module').then(m => m.BsComponentModule) },
            { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule) },
            { path: 'dashboard', component: MainDashboardComponent, canActivate: [AuthGuard] },
            { path: 'staff-dashboard', component: StaffDashboardComponent, canActivate: [AuthGuard] },
            { path: 'elders', component: EldersComponent, canActivate: [AuthGuard] },
            { path: 'elders/add', component: EldersAddPageComponent, canActivate: [AuthGuard] },
            { path: 'elders/details', component: EldersDetailsComponent, canActivate: [AuthGuard] },
            { path: 'staff', component: StaffComponent, canActivate: [AuthGuard] },
            { path: 'staff/add', component: StaffAddComponent, canActivate: [AuthGuard] },
            { path: 'staff/details', component: StaffDetailsComponent, canActivate: [AuthGuard] },
            { path: 'hospitals', component: HospitalsComponent, canActivate: [AuthGuard] },
            { path: 'hospitals/details', component: HospitalDetailsComponent, canActivate: [AuthGuard] },
            { path: 'doctor-list', component: DoctorListComponent, canActivate: [AuthGuard] },
            { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
            { path: 'medicine-inventory', component: MedicineInventoryComponent, canActivate: [AuthGuard] },
            { path: 'guess-monitoring', component: GuestMonitoringComponent, canActivate: [AuthGuard] },
            { path: 'archives', component: ArchivesComponent, canActivate: [AuthGuard] },
            { path: 'system-users', component: SystemUsersComponent, canActivate: [AuthGuard] },
            { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
