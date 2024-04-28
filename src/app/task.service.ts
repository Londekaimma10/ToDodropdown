import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask } from './model/task';
import { environment } from 'src/environment/environment';
import { EmployeeJobTitle } from './model/employeejobtitle';
import { EmployeeName } from './model/employeename';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getEmployeesJobTitle(): Observable<EmployeeJobTitle[]>{
   return this.http.get<any>(`${this.apiServerUrl}/jobTitle/all`);
}

 public addJobTitle(empjobtitle: EmployeeJobTitle): Observable<EmployeeJobTitle>{
  return this.http.post<EmployeeJobTitle>(`${this.apiServerUrl}/jobTitle/add`, empjobtitle);
  }
  
  public getEmployees(): Observable<EmployeeName>{
    return this.http.get<EmployeeName>(`${this.apiServerUrl}/employee/all`);
  }

   public addEmployee(employee: EmployeeName): Observable<EmployeeName>{
    return this.http.post<EmployeeName>(`${this.apiServerUrl}/employee/add`, employee);
  }



}