import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'src/Models/IEmployee';
import { EmployeeService } from 'src/Services/employee.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-employees',
  templateUrl: './employeelist.component.html',
//  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  employees: IEmployee[];

  constructor(private _employeeService: EmployeeService, private _router: Router) { }

  ngOnInit() {
    this._employeeService.getEmployees().subscribe(
      (employeeList) => this.employees = employeeList,
      (err) => console.log(err)
    );
  }

  EditEmployee(empId: number) {
  this._router.navigate(['/edit', empId]);
  }
  CreateEmployee(): void {
    this._router.navigate(['/create']);
  }
}
