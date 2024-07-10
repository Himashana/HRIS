import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EmployeesService} from "../../../services/employees.service";
import {NGXLogger} from "ngx-logger";
import {DepartmentService} from "../../../services/department.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {Observable, Subscription, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  CreateDepartmentDialogComponent
} from "../../dialogs/create-department-dialog/create-department-dialog.component";
import {ShiftsService} from "../../../services/shifts.service";
import {MatDialog} from "@angular/material/dialog";
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeUpdateComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  employeeForm: FormGroup | any;
  organizationId: any;
  departmentId:any
  departmentDataStore:any;
  selectedDepartment:any;
  employeeDataStore:any;
  employee:any;
  userId:any;
  chosenPhoto: File | any;

  filteredDepartments: any[] = [];

  holidaysStore:any[] = [];
  filteredHolidays:any[] = [];
  disabledDates: any[] = [];

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return true;
    }
    const time = date.getTime();
    return !this.disabledDates.includes(time);
  }

  constructor(private formBuilder: FormBuilder,
              private shiftService: ShiftsService,
              private employeeService: EmployeesService,
              private logger: NGXLogger,
              private eventService: EventService,
              private departmentService:DepartmentService,
              private multimediaService: MultimediaService,
              private changeDetectorRef: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private cookieService: AuthService) { }

  async ngOnInit(): Promise<any> {
    this.organizationId = this.cookieService.organization().toString();

    this.initForm()

    this.subscriptions.add(this.loadAllDepartments().subscribe());
    this.subscriptions.add(this.loadAllUsers().subscribe(() => this.getUser()));
    this.subscriptions.add(this.loadAllHolidays().subscribe(() => {
      this.filterHolidays()
      this.addDisabledDates()
    }));
  }

  ngOnDestroy(){
    // Unsubscribe from all subscriptions
    this.subscriptions.unsubscribe();
    this.clearImage();
  }

  initForm(){
    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      mname: [''],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      telephone: ['', Validators.required],
      address: ['', Validators.required],
      jobData: this.formBuilder.group({
        employementType: ['', Validators.required],
        position: ['', Validators.required], // designation
        jobGrade: ['', Validators.required],
        personalGrade: ['', Validators.required],
        supervisor: ['', Validators.required],
        businessUnit: ['', Validators.required],
        department: [sessionStorage.getItem('dep'), Validators.required],
        location: ['', Validators.required],
        branch: ['', Validators.required],
        salary: ['', Validators.required],
        doj: ['', Validators.required],
      }),
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      nic: ['', Validators.required],
      photo: [null],
      status: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      nationality: ['', Validators.required],
      religion: ['', Validators.required],
      dateOfRetirement: ['', Validators.required],
      dateOfExit: ['', Validators.required],
      exitReason: ['', Validators.required],
      dateOfContractEnd: ['', Validators.required]
    });
  }

  loadAllUsers(): Observable<any>{
    return this.employeeService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  getUser() {
    this.employeeDataStore.forEach((emp:any) => {
      this.route.paramMap.subscribe(params => {
        this.userId = params.get('id');

        if (emp.id == this.userId) {
          this.employee = [emp];
          this.patchValues()
        }
      })
    })
  }

  patchValues() {
    const firstName = this.employee[0].name;
    this.employeeForm.get('name')?.setValue(firstName.split(' ')[0]);
    this.employeeForm.get('mname')?.setValue(firstName.split(' ')[1]?firstName.split(' ')[1]:'');
    this.employeeForm.get('lname')?.setValue(firstName.split(' ')[2]);
    this.employeeForm.get('dob')?.setValue(new Date(this.employee[0].dob));
    this.employeeForm.get('nic')?.setValue(this.employee[0].nic);
    this.employeeForm.get('gender')?.setValue(this.employee[0].gender);
    this.employeeForm.get('address')?.setValue(this.employee[0].address);
    this.employeeForm.get('email')?.setValue(this.employee[0].email);
    this.employeeForm.get('phone')?.setValue(this.employee[0].phone);
    this.employeeForm.get('telephone')?.setValue(this.employee[0].telephone);
    this.employeeForm.get('maritalStatus')?.setValue(this.employee[0].maritalStatus);
    this.employeeForm.get('nationality')?.setValue(this.employee[0].nationality);
    this.employeeForm.get('religion')?.setValue(this.employee[0].religion);
    this.employeeForm.get('dateOfRetirement')?.setValue(new Date(this.employee[0].dateOfRetirement));
    this.employeeForm.get('dateOfExit')?.setValue(new Date(this.employee[0].dateOfExit));
    this.employeeForm.get('exitReason')?.setValue(this.employee[0].exitReason);
    this.employeeForm.get('dateOfContractEnd')?.setValue(new Date(this.employee[0].dateOfContractEnd));

    // Access the jobData group within employeeForm and set its values
    const jobData = this.employeeForm.get('jobData') as FormGroup;
    jobData.get('department')?.setValue(this.employee[0].jobData.department);
    this.changeDetectorRef.detectChanges();
    jobData.get('position')?.setValue(this.employee[0].jobData.position);
    jobData.get('businessUnit')?.setValue(this.employee[0].jobData.businessUnit);
    jobData.get('supervisor')?.setValue(this.employee[0].jobData.supervisor);
    jobData.get('location')?.setValue(this.employee[0].jobData.location);
    jobData.get('jobGrade')?.setValue(this.employee[0].jobData.jobGrade);
    jobData.get('personalGrade')?.setValue(this.employee[0].jobData.personalGrade);
    jobData.get('employementType')?.setValue(this.employee[0].jobData.employementType);
    jobData.get('branch')?.setValue(this.employee[0].jobData.branch);
    jobData.get('doj')?.setValue(this.employee[0].jobData.doj);
    jobData.get('salary')?.setValue(this.employee[0].jobData.salary);

    this.employeeForm.get('status')?.setValue(this.employee[0].status);
    this.selectedDepartment = this.employee[0].jobData.department;
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }

  loadAllHolidays(): Observable<any> {
    return this.eventService.getHolidays().pipe(
      tap(data => this.holidaysStore = data)
    );
  }

  filterHolidays():any[]{
    this.filteredHolidays = this.holidaysStore.filter((data:any) => data.meta.organizationId == this.organizationId)

    return this.filteredHolidays;
  }

  addDisabledDates(): void {
    this.disabledDates = [];
    this.filterHolidays().forEach((h:any) => {
      this.disabledDates.push(new Date(h.start).getTime())
    })
  }

  onSubmit() {
    sessionStorage.setItem('orgId', this.cookieService.organization())
    sessionStorage.setItem('updatingUserId', this.userId)
    if (this.employeeForm.valid) {
      const jobData = this.employeeForm.get('jobData').value;
      this.employeeForm.patchValue({ jobData: null });

      const formData = new FormData();
      for (const key in this.employeeForm.value) {
        if (this.employeeForm.value.hasOwnProperty(key)) {
          formData.append(key, this.employeeForm.value[key]);
        }
      }

      // Append jobData fields to the formData
      const stringifiedJobData = typeof jobData === 'object' ? JSON.stringify(jobData) : jobData;
      sessionStorage.setItem('jobData', stringifiedJobData);
      formData.append('jobData', stringifiedJobData);

      this.departmentDataStore.forEach((d:any) => {
        if (d.name == this.selectedDepartment){
          sessionStorage.setItem('depId', d.id);
        }
      })

      this.employeeService.updateFullEmployeeById(this.userId, formData);
      location.reload()
    } else {
      this.snackBar.open("Some required fields are missing!","OK",{duration:2000})
    }
  }

  loadAllDepartments(): Observable<any> {
    return this.departmentService.getAllDepartments().pipe(
        tap(data => this.departmentDataStore = data)
    );
  }

  filterDepartments():any[]{
    this.filteredDepartments = this.departmentDataStore.filter((dep:any) => dep.organizationId == this.organizationId)

    return this.filteredDepartments;
  }

  choosePhoto(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg';
    input.onchange = (event: any) => {
      this.handleFileInput(event);
    };
    input.click();
  }

  handleFileInput(event: any): void {
    const maxSize = 5 * 1024 * 1024;
    const files = event.target.files;
    if (files.length > 0 && files[0].size <= maxSize) {
      this.clearImage();  // Clear the previous image
      this.chosenPhoto = files[0];
      this.employeeForm.patchValue({ photo: this.chosenPhoto });
      this.onFileSelected();
    } else {
      alert("Your Image is too large. Select under 5MB");
    }
  }

  onFileSelected() {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const imgtag: any = document.getElementById("empAddProfile");
      imgtag.src = event.target?.result;
    };
    if (typeof this.chosenPhoto !== 'string') {
      reader.readAsDataURL(this.chosenPhoto);
    }
  }

  clearImage() {
    if (this.chosenPhoto) {
      URL.revokeObjectURL(this.chosenPhoto);
      this.chosenPhoto = null;
      const imgtag: any = document.getElementById("empAddProfile");
      if (imgtag) {
        imgtag.src = '';
      }
    }
  }

  defaultPhoto() {
    // Check if default photo already loaded
    if (this.chosenPhoto) {
      return;
    }

    // Create a path to the default image file in the assets folder
    const defaultImagePath = 'assets/imgs/shared/default_profile.jpg';

    // Load the default image file
    fetch(defaultImagePath)
      .then(response => response.blob())
      .then(blob => {
        // Revoke previous object URL if any
        if (this.chosenPhoto) {
          URL.revokeObjectURL(this.chosenPhoto);
        }

        // Create a File object from the blob
        const defaultImageFile = new File([blob], 'default_profile.jpg', { type: 'image/jpeg' });

        // Assign the default image file to the chosenPhoto variable
        this.chosenPhoto = defaultImageFile;
        this.employeeForm.patchValue({ photo: this.chosenPhoto });

        // Display the default image in the UI
        const imgtag: any = document.getElementById("empAddProfile");
        imgtag.src = URL.createObjectURL(this.chosenPhoto);
      })
      .catch(error => {
        console.error('Failed to load default image:', error);
      });
  }

  addDepartment() {
    const data = {
      organizationId: this.organizationId
    }
    this.toggleDialog('','',data,CreateDepartmentDialogComponent)
  }

  toggleDialog(title:any, msg:any, data: any, component:any) {
    const _popup = this.dialog.open(component, {
      maxHeight: '80vh',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.loadAllDepartments().subscribe(()=>{
        this.filterDepartments()
      })
    })
  }
}
