import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTableComponent } from './shared/components/employee-table/employee-table.component';

const routes: Routes = [
  
  {
    path: 'empDashboard',
    component: EmployeeTableComponent
  },
  {
    path: '',
    redirectTo: 'empDashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
