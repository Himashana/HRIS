import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {OnboardinPlan} from "../shared/data-models/OnboardinPlan";
import {Observable} from "rxjs";
import {Onboardin} from "../shared/data-models/Onboardin";
import {EmployeeModel} from "../shared/data-models/Employee.model";

@Injectable({
  providedIn: 'root'
})
export class OnboardinService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  public saveOnboardingPlan(plan: OnboardinPlan): Observable<any> {
    return this.http.post(this.baseUrl+'onboardingPlan/save',plan);
  }

  public deleteOnboardingPlan(id:any):Observable<any> {
    return this.http.delete(this.baseUrl+'onboardingPlan/delete/id/'+id);
  }

  public updatePlan(plan: OnboardinPlan): Observable<any> {
    return this.http.put(this.baseUrl+'onboardingPlan/update/id/'+plan.id, plan);
  }

  public saveOnboardin(onboarding: Onboardin): Observable<any> {
    return this.http.post(this.baseUrl+'onboarding/save', onboarding);
  }

  public saveTasksList(planId:any, onboarding: any): Observable<any> {
    return this.http.post(this.baseUrl+'onboarding/save/tasks/'+planId, onboarding);
  }

  public updateTasksList(planId:any, onboarding: any): Observable<any> {
    return this.http.put(this.baseUrl+'onboarding/update/tasks/'+planId, onboarding);
  }

  public getAllPlans(): Observable<any> {
    return this.http.get(this.baseUrl+'onboardingPlan/get/all');
  }

  public getAllTasks(): Observable<any> {
    return this.http.get(this.baseUrl+'onboarding/get/all');
  }

  public assignEmployeeToTask(id: any, employee: EmployeeModel[]): Observable<any> {
    return this.http.put(this.baseUrl+'onboarding/assign/employee/'+id, employee);
  }

  public editTaskById(id:any, onboarding: Onboardin): Observable<any> {
    return this.http.put(this.baseUrl+'onboarding/update/id/'+id, onboarding)
  }
}
