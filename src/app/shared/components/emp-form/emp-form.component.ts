import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Iemployee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-emp-form',
  templateUrl: './emp-form.component.html',
  styleUrls: ['./emp-form.component.scss'],
})
export class EmpFormComponent implements OnInit {
  empForm!: FormGroup;
  education: Array<string> = [
    'SSC',
    'HSC',
    'Diploma',
    'Graduation',
    'Post Graduation',
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogref: MatDialogRef<EmpFormComponent>,
    private _employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.createEmpForm();
  }

  createEmpForm() {
    this.empForm = this._formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      contact: [null, [Validators.required]],
      gender: [null],
      dob: [null, [Validators.required]],
      education: [null, [Validators.required]],
      experience: [null, [Validators.required]],
      company: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.empForm.valid) {
      let newEmployee: Iemployee = this.empForm.value;
      console.log(newEmployee);
      this._employeeService.addEmployee(newEmployee).subscribe({
        next: (res) => {
          this._dialogref.close({ ...newEmployee, id: res.name });
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
