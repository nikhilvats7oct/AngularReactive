import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';


import { EmployeeService } from 'src/Services/employee.service';

import { AppComponent } from './app.component';
import { CreateEmployeeComponent } from './UI/CreateEmployee/createemployee.component';
import { ListEmployeesComponent } from './UI/EmployeeList/employeelist.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateEmployeeComponent,
    ListEmployeesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
