import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {EmployeeModel} from "../shared/data-models/Employee.model";
import {NGXLogger} from "ngx-logger";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private logger: NGXLogger, private snackBar: MatSnackBar) { }

  private sendToBackend(formData: FormData, headers: HttpHeaders): void {

    this.http.post(this.baseUrl + 'employee/save', formData, {headers}).subscribe(
      response => {
        sessionStorage.clear();
        this.snackBar.open("Employee added successfully!", "OK", {duration:3000})
      },
      error => {
        this.snackBar.open("Server error! try again in few minutes", "OK", {duration:3000})
      }
    );
  }

  public setActivityStatus(id: any, timestamp:any): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/active/set-status/'+id,{
      lastSeen:timestamp
    });
  }

  public getAllEmployees(): Observable<any> {
    return this.http.get(this.baseUrl + 'employee/get/all');
  }

  public getEmployeeById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'employee/get/id/' + id);
  }

  public getEmployeeByEmail(email: string): Observable<any> {
    return this.http.get(this.baseUrl + 'employee/get/email/' + email);
  }

  public addEmployee(employeeModel: EmployeeModel): Observable<any> {
    return this.http.post(this.baseUrl + 'employee/save', {
      name: employeeModel.name,
      email: employeeModel.email,
      phone: employeeModel.phone,
      address: employeeModel.address,
      organizationId: employeeModel.organizationId,
      departmentId: employeeModel.departmentId,
      channels: employeeModel.channels,
      jobData: employeeModel.jobData,
      gender: employeeModel.gender,
      dob: employeeModel.dob,
      photo: employeeModel.photo,
      status: employeeModel.status,
      level: employeeModel.level
    });
  }

  public updateEmployeeById(id: string, form:FormData): void {
    const fileInput = form.get('photo') as File;

    if (fileInput) {

      const requestBody:any = {
        id: form.get('id') as string,
        name: form.get('name') as string,
        email: form.get('email') as string,
        phone: form.get('phone') as string,
        telephone: form.get('telephone') as string,
        address: form.get('address') as string,
        organizationId: form.get('organizationId') as string,
        departmentId: form.get('departmentId') as string,
        jobData: form.get('jobData'),
        gender: form.get('gender') as string,
        dob: form.get('dob') as string,
        nic: form.get('nic') as string,
        photo: fileInput,
        status: form.get('status') as string,
        level: form.get('level') as string,
        maritalStatus: form.get('maritalStatus') as string,
        nationality: form.get('nationality') as string,
        religion: form.get('religion') as string,
        dateOfRetirement: form.get('dateOfRetirement') as string,
        dateOfExit: form.get('dateOfExit') as string,
        exitReason: form.get('exitReason') as string,
        dateOfContractEnd: form.get('dateOfContractEnd') as string
      };

      this.logger.info(requestBody.jobData);

      // Set Content-Type header to multipart/form-data
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');

      // Call backend API to save employee data
      this.sendToBackendUpdate(form, headers);
    }
    else {
      const requestBody:any = {
        id: form.get('id') as string,
        name: form.get('name') as string,
        email: form.get('email') as string,
        phone: form.get('phone') as string,
        telephone: form.get('telephone') as string,
        address: form.get('address') as string,
        organizationId: form.get('organizationId') as string,
        departmentId: form.get('departmentId') as string,
        jobData: form.get('jobData'),
        gender: form.get('gender') as string,
        dob: form.get('dob') as string,
        nic: form.get('nic') as string,
        status: form.get('status') as string,
        level: form.get('level') as string,
        maritalStatus: form.get('maritalStatus') as string,
        nationality: form.get('nationality') as string,
        religion: form.get('religion') as string,
        dateOfRetirement: form.get('dateOfRetirement') as string,
        dateOfExit: form.get('dateOfExit') as string,
        exitReason: form.get('exitReason') as string,
        dateOfContractEnd: form.get('dateOfContractEnd') as string
      };

      this.logger.info(requestBody.jobData);

      // Set Content-Type header to multipart/form-data
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');

      // Call backend API to save employee data
      this.sendToBackendUpdate(form, headers);
    }
  }

  private sendToBackendUpdate(formData: FormData, headers: HttpHeaders): void {

    this.http.put(this.baseUrl + 'employee/update/id/'+formData.get('id'), formData, {headers}).subscribe(
        response => {
          console.log('Employee data updated successfully:', response);
        },
        error => {
          console.error('Error updated employee data:', error);
        }
    );
  }

  public updateFullEmployeeById(id: string, form:FormData): void {
    const fileInput = form.get('photo') as File;

    if (fileInput) {

      const requestBody:any = {
        id: sessionStorage.getItem('updatingUserId') as string,
        name: form.get('name') +" "+ form.get('lname') as string,
        email: form.get('email') as string,
        phone: form.get('phone') as string,
        telephone: form.get('telephone') as string,
        address: form.get('address') as string,
        organizationId: sessionStorage.getItem('orgId') as string,
        departmentId: sessionStorage.getItem('depId') as string,
        jobData: sessionStorage.getItem('jobData'),
        gender: form.get('gender') as string,
        dob: form.get('dob') as string,
        nic: form.get('nic') as string,
        photo: fileInput,
        status: form.get('status') as string,
        level: form.get('level') as string,
        maritalStatus: form.get('maritalStatus') as string,
        nationality: form.get('nationality') as string,
        religion: form.get('religion') as string,
        dateOfRetirement: form.get('dateOfRetirement') as string,
        dateOfExit: form.get('dateOfExit') as string,
        exitReason: form.get('exitReason') as string,
        dateOfContractEnd: form.get('dateOfContractEnd') as string
      };

      const formData = new FormData();
      for (const key in requestBody) {
        if (requestBody.hasOwnProperty(key)) {
          if (key === 'jobData1') {
            formData.append(key, JSON.stringify(requestBody[key])); // Stringify jobData here
          } else {
            formData.append(key, requestBody[key]);
          }
        }
      }

      // Set Content-Type header to multipart/form-data
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');

      // Call backend API to save employee data
      this.sendToBackendFullUpdate(formData, headers);
    }
    else {
      const requestBody:any = {
        id: sessionStorage.getItem('updatingUserId') as string,
        name: form.get('name') +" "+ form.get('lname') as string,
        email: form.get('email') as string,
        phone: form.get('phone') as string,
        telephone: form.get('telephone') as string,
        address: form.get('address') as string,
        organizationId: sessionStorage.getItem('orgId') as string,
        departmentId: sessionStorage.getItem('depId') as string,
        jobData: sessionStorage.getItem('jobData'),
        gender: form.get('gender') as string,
        dob: form.get('dob') as string,
        nic: form.get('nic') as string,
        status: form.get('status') as string,
        level: form.get('level') as string,
        maritalStatus: form.get('maritalStatus') as string,
        nationality: form.get('nationality') as string,
        religion: form.get('religion') as string,
        dateOfRetirement: form.get('dateOfRetirement') as string,
        dateOfExit: form.get('dateOfExit') as string,
        exitReason: form.get('exitReason') as string,
        dateOfContractEnd: form.get('dateOfContractEnd') as string
      };

      this.logger.info(requestBody.jobData);
      const formData = new FormData();
      for (const key in requestBody) {
        if (requestBody.hasOwnProperty(key)) {
          if (key === 'jobData1') {
            formData.append(key, JSON.stringify(requestBody[key])); // Stringify jobData here
          } else {
            formData.append(key, requestBody[key]);
          }
        }
      }

      // Set Content-Type header to multipart/form-data
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');

      // Call backend API to save employee data
      this.sendToBackendFullUpdate(formData, headers);
    }
  }

  private sendToBackendFullUpdate(formData: FormData, headers: HttpHeaders): void {

    this.http.put(this.baseUrl + 'employee/update/full/id/'+formData.get('id'), formData, {headers}).subscribe(
        response => {
          console.log('Employee data updated successfully:', response);
        },
        error => {
          console.error('Error updated employee data:', error);
        }
    );
  }

  public updateEmployeeByEmail(email: string, employeeModel: EmployeeModel): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/update/email/' + email, {
      name: employeeModel.name,
      email: employeeModel.email,
      phone: employeeModel.phone,
      address: employeeModel.address,
      organizationId: employeeModel.organizationId,
      departmentId: employeeModel.departmentId,
      channels: employeeModel.channels,
      jobData: employeeModel.jobData,
      gender: employeeModel.gender,
      dob: employeeModel.dob,
      photo: employeeModel.photo,
      status: employeeModel.status,
      level: employeeModel.level
    });
  }

  public deleteEmployeeById(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'employee/delete/id/' + id);
  }

  public deleteEmployeeByEmail(email: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'employee/delete/email/' + email);
  }

  uploadEmployeeData(form: FormData): void {
    const fileInput = form.get('photo') as File;

    if (fileInput) {
      const jobData = form.get('jobData') as Object;

      const requestBody: any = {
        name: form.get('name') + " " + form.get('lname') as string,
        email: form.get('email') as string,
        phone: form.get('phone') as string,
        telephone: form.get('telephone') as string,
        address: form.get('address') + " " + form.get('city') + " " + form.get('state') + " " + form.get('zip') as string,
        organizationId: sessionStorage.getItem('orgId') as string,
        departmentId: sessionStorage.getItem('depId') as string,
        jobData: sessionStorage.getItem('jobData'),
        workShift: JSON.parse(sessionStorage.getItem('shift') as string), // Ensure workShift is sent as a JSON array
        gender: form.get('gender') as string,
        dob: form.get('dob') as string,
        nic: form.get('nic') as string,
        photo: fileInput,
        status: form.get('status') as string,
        level: "2" as string,
        maritalStatus: form.get('maritalStatus') as string,
        nationality: form.get('nationality') as string,
        religion: form.get('religion') as string,
        dateOfRetirement: form.get('dateOfRetirement') as string,
        dateOfExit: form.get('dateOfExit') as string,
        exitReason: form.get('exitReason') as string,
        dateOfContractEnd: form.get('dateOfContractEnd') as string,
        annualLeaveBalance: sessionStorage.getItem('annual'),
        sickLeaveBalance: sessionStorage.getItem('sick'),
        casualLeaveBalance: sessionStorage.getItem('casual'),
        maternityLeaveBalance: sessionStorage.getItem('maternity'),
        paternityLeaveBalance: sessionStorage.getItem('paternity'),
        noPayLeaveBalance: sessionStorage.getItem('noPay')
      };

      const formData = new FormData();
      for (const key in requestBody) {
        if (requestBody.hasOwnProperty(key)) {
          if (key === 'jobData1' || key === 'workShift') {
            formData.append(key, JSON.stringify(requestBody[key])); // Stringify jobData and workShift here
          } else {
            formData.append(key, requestBody[key]);
          }
        }
      }

      // Set Content-Type header to multipart/form-data
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');

      // Call backend API to save employee data
      this.sendToBackend(formData, headers);
    }
  }

  public updateLevel(id: string, level: string): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/update/level/' + id, {
      id: id,
      level: level
    });
  }

  public assignShift(id: string, shift: any): Observable<any> {
    return this.http.post(this.baseUrl + 'employee/assign/shift/' + id, shift);
  }

  public updateShift(id: string, shift: any): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/update/shift/' + id, shift);
  }

  public updateEmployeeLeaves(id: string, leaves: any): Observable<any> {
    return this.http.put(this.baseUrl + 'employee/update/leave/count/' + id, {
      annualLeaveBalance: leaves.annualLeaveBalance,
      sickLeaveBalance: leaves.sickLeaveBalance,
      casualLeaveBalance: leaves.casualLeaveBalance,
      maternityLeaveBalance: leaves.maternityLeaveBalance,
      paternityLeaveBalance: leaves.paternityLeaveBalance,
      noPayLeaveBalance: leaves.noPayLeaveBalance
    });
  }
}
