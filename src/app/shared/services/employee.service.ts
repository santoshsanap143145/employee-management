import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Iemployee, IempRef } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  BASE_URL: string = environment.baseUrl
  EMPLOYEE_URL: string = `${this.BASE_URL}/employees`
  constructor(private _http: HttpClient) { }

  addEmployee(data: Iemployee): Observable<any>{
    return this._http.post<any>(`${this.EMPLOYEE_URL}.json`, data)
  }

  fetchAllData():Observable<IempRef>{
    return this._http.get<IempRef>(`${this.EMPLOYEE_URL}.json`)
  }

  updateEmpData(id: string, data: any): Observable<any>{
    return this._http.patch<any>(`${this.EMPLOYEE_URL}/${id}.json`, data)
  }

  deleteEmployee(id: string): Observable<any>{
    return this._http.delete<any>(`${this.EMPLOYEE_URL}/${id}.json`)
  }
}
