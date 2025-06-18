import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { Iemployee } from '../../models/employee.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { GetConfirmComponent } from '../get-confirm/get-confirm.component';
import { EmpFormComponent } from '../emp-form/emp-form.component';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss'],
})
export class EmployeeTableComponent implements OnInit {
  empArr: Array<any> = [];
  displayedColumns: Array<string> = [
    'no',
    'firstName',
    'lastName',
    'email',
    'contact',
    'dob',
    'gender',
    'education',
    'company',
    'experience',
    'actions',
  ];
  dataSource = new MatTableDataSource<Iemployee>([]);
  filterText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  rowForms: { [id: string]: FormGroup } = {};
  constructor(
    private _empService: EmployeeService,
    private _fb: FormBuilder,
    private _snackbar: SnackbarService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  openForm() {
    const dialogRef = this._matDialog.open(EmpFormComponent, {
      width: '50%',
      // disableClose: true,
    });

    dialogRef.afterClosed().subscribe((empObj) => {
      if (empObj) {
        this.empArr = [empObj, ...this.empArr];
        this.dataSource.data = this.empArr;
        this._snackbar.openSnackBar(
          `New Employee ${empObj.firstName} ${empObj.lastName} is added successfully!!!`
        );
      }
    });
  }

  getEmployees() {
    this._empService.fetchAllData().subscribe({
      next: (res) => {
        this.empArr = Object.keys(res).map((key) => {
          const employees = { ...res[key], id: key, isEditMode: false };
          this.rowForms[key] = this._fb.group({
            firstName: [employees.firstName],
            lastName: [employees.lastName],
            email: [employees.email],
            contact: [employees.contact],
            dob: [employees.dob],
            gender: [employees.gender],
            education: [employees.education],
            company: [employees.company],
            experience: [employees.experience],
          });
          return employees;
        });
        console.log(this.empArr);

        this.dataSource.data = this.empArr.reverse();
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterText = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onEdit(row: Iemployee) {
    row.isEditMode = true;
  }

  onSave(row: Iemployee) {
    const updatedData = this.rowForms[row.id].value!;
    const newData: Iemployee = {
      ...updatedData,
      id: row.id,
    };
    this._empService.updateEmpData(row.id, updatedData).subscribe({
      next: (res) => {
        row.isEditMode = false;
        Object.assign(row, newData);
        this._snackbar.openSnackBar(
          `The Employee ${newData.firstName} ${newData.lastName} is updated successfully!!!`
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onCancel(row: Iemployee) {
    row.isEditMode = false;
    const form = this.rowForms[row.id];
    if (form) {
      form.patchValue({ ...row });
    }
  }

  onDelete(row: Iemployee) {
    const dialogRef = this._matDialog.open(GetConfirmComponent, {
      width: '350px',
      disableClose: true,
      data: {
        message: `Are you sure, you wan to delete ${row.firstName} ${row.lastName}?`,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._empService.deleteEmployee(row.id).subscribe({
          next: (res) => {
            this._snackbar.openSnackBar(
              `The Employee ${row.firstName} ${row.lastName} is removed successfully!!`
            );
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  getControls(rowId: string, controlName: string) {
    return this.rowForms[rowId].get(controlName) as FormControl;
  }
}
