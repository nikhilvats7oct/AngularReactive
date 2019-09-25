import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEmployeeComponent } from './UI/CreateEmployee/createemployee.component';
import { ListEmployeesComponent } from './UI/EmployeeList/employeelist.component';

const routes: Routes = [
  { path: 'list', component: ListEmployeesComponent },
  { path: 'create', component: CreateEmployeeComponent },
  { path: 'edit/:id', component: CreateEmployeeComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 
}
