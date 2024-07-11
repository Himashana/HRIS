import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { EmployeesService } from '../../services/employees.service';
import { CredentialsService } from '../../services/credentials.service';
import {EncryptionService} from "../../services/encryption.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  userId: any;

  employeeDataStore: any[] = [];
  employee: any = {};

  credentialsDataStore: any[] = [];
  filteredCredentials: any[] = [];
  currentPassword: any;

  changePasswordForm: FormGroup | any;

  hide = true;
  newHide = true;
  currentHide = true;

  constructor(private cookieService: AuthService,
              private employeeService: EmployeesService,
              private encryptService: EncryptionService,
              private snackBar: MatSnackBar,
              private router: Router,
              private credentialsService: CredentialsService) { }

  async ngOnInit(): Promise<void> {
    this.userId = this.cookieService.userID().toString();

    this.initializeForm();

    await this.getAllUsers().toPromise().then(() => {
      this.getUser();
    });

    await this.getAllCredentials().toPromise().then(() => {
      this.filterCredentials();
      this.currentPassword = this.encryptService.decryptPassword(this.filteredCredentials[0].password);
    });
  }

  initializeForm(): void {
    this.changePasswordForm = new FormGroup({
      old: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      newPass: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirm: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });

    this.changePasswordForm.get('confirm').setValidators([
      Validators.required,
      Validators.minLength(6),
      this.passwordMatch.bind(this)
    ]);

    this.changePasswordForm.get('old').setValidators([
      Validators.required,
      Validators.minLength(6),
      this.currentPasswordMatch.bind(this)
    ]);

    this.changePasswordForm.get('confirm').updateValueAndValidity();
    this.changePasswordForm.get('old').updateValueAndValidity();
  }

  getAllUsers(): Observable<any> {
    return this.employeeService.getAllEmployees().pipe(
      tap(data => this.employeeDataStore = data)
    );
  }

  getUser(): void {
    this.employeeService.getEmployeeById(this.userId).subscribe(data => {
      this.employee = data;
    });
  }

  getAllCredentials(): Observable<any> {
    return this.credentialsService.getAllCredentials().pipe(
      tap(data => this.credentialsDataStore = data)
    );
  }

  filterCredentials(): any[] {
    this.filteredCredentials = this.credentialsDataStore.filter((user: any) => user.email === this.employee.email);

    return this.filteredCredentials
  }

  passwordMatch(control: AbstractControl): ValidationErrors | null {
    if (!this.changePasswordForm) {
      return null;
    }

    if (control.value !== this.changePasswordForm.get('newPass').value) {
      return { mismatch: true };
    }

    return null;
  }

  currentPasswordMatch(control: AbstractControl): ValidationErrors | null {
    if (!this.changePasswordForm) {
      return null;
    }

    if (control.value !== this.currentPassword) {
      return { mismatch: true };
    }

    return null;
  }

  submitChangePassword(): void {
    if (this.changePasswordForm.valid) {
      this.credentialsService.changePassword(this.filteredCredentials[0].email, {
        password: this.changePasswordForm.value.confirm
      }).subscribe(data => {
        this.changePasswordForm.reset();
        this.snackBar.open('Password changed successfully', 'Close', {
          duration: 3000
        });

        this.cookieService.logout();
        this.router.navigate(['/login']).then(() => {
          location.reload();
        });
      }, error => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 3000
        });
      });
    }
  }

  clearForm(): void {
    this.changePasswordForm.reset();
  }
}
