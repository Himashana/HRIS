import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeePayitemService } from 'src/app/services/employee-payitem.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { PayitemService } from 'src/app/services/payitem.service';
import { EmployeeModel } from 'src/app/shared/data-models/Employee.model';
import { EmployeePayItemModel } from 'src/app/shared/data-models/employee-payitem.model';
import { PayItemModel } from 'src/app/shared/data-models/payitem.model';

@Component({
  selector: 'app-view-employee-payitems',
  templateUrl: './view-employee-payitems.component.html',
  styleUrls: ['./view-employee-payitems.component.scss']
})
export class ViewEmployeePayitemsComponent {

  employeePayitemModel = new EmployeePayItemModel();
  currentEmployee!: EmployeeModel;

  totalSalaryOfTheSelectedEmployee: number = 0.0;

  payItemsList: PayItemModel[] = [];
  employeePayitemsList: EmployeePayItemModel[] = [];

  selectedEmployeeBasicSalary: number = 0.0;

  notfoundError = false;

  editEnabledItemId: String = "";
  editEnabledItemValue: number = 0.0;
  isEditEnabledItemInputsDisabled: boolean = false;

  isDisplayAssignNewItemForm = true;
  

  constructor(private employeePayitemService: EmployeePayitemService,
    private payitemService: PayitemService,
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
    private _snackBar: MatSnackBar,
    private cookieService: AuthService
  ){}

  ngOnInit(): void {
      this.employeesService.getEmployeeById(this.route.snapshot.params['id']).subscribe(res => {
        this.currentEmployee = res;
        this.viewEmployeePaymentDetails(this.currentEmployee);
      },(error: any) => {
        this.notfoundError = true;
      });
  };

  updatePayitemsList(){
    this.payitemService.getAllPayitems(this.cookieService.organization()).subscribe((res: any) => {

      let loadedPayitemsList: PayItemModel[] = [];

      for(let payitem of res){
        if(payitem.status != "Unavailable" && !this.isPayItemIdInEmployeePayitemsList(payitem.id)){
          loadedPayitemsList.push(payitem);
        }
      }
      
      if(JSON.stringify(this.payItemsList) !== JSON.stringify(loadedPayitemsList)){
        this.payItemsList = loadedPayitemsList;
      }  
    });
  }

  isPayItemIdInEmployeePayitemsList(payItemId: String): boolean {
    for (let empPayitem of this.employeePayitemsList) {
      if (empPayitem.payItemId === payItemId) {
        return true;
      }
    }
    return false;
  }

    viewEmployeePaymentDetails(employeeModel: EmployeeModel){
      this.totalSalaryOfTheSelectedEmployee = 0.0;
  
      // this.resetAssignPayitemForm();
  
      this.employeePayitemService.getPayItemsByEmail(employeeModel.email).subscribe((res:any) =>{
        if(res){
  
            if (res.length > 0){
              this.selectedEmployeeBasicSalary = res[0].value;
            }
  
            for(let employeePayitem of res){
              
              this.payitemService.getPayItemById(employeePayitem.payItemId).subscribe((payitemRes:any) =>{
                if(payitemRes){
                  
                      employeePayitem.payitem = payitemRes;
  
                      if(employeePayitem.type == "Percentage"){
                        employeePayitem.amount = this.selectedEmployeeBasicSalary * (employeePayitem.value/100);
                        employeePayitem.payitem.paymentType += " (" + employeePayitem.value + "% of basic)";
                      }else if(employeePayitem.type == "Hourly Rate"){              
                          // employeePayitem.amount = employeePayitem.value * parseFloat(hoursWorkedRes.toString());
                          employeePayitem.amount = 0.00;
                          employeePayitem.payitem.paymentType += " (" + employeePayitem.value + "% Hourly Rate)";
                        }else{
                        employeePayitem.amount = employeePayitem.value;
                      }
  
                      if(employeePayitem.payitem.itemType == "Deletion"){
                        this.totalSalaryOfTheSelectedEmployee -= employeePayitem.amount;
                      }else{
                        this.totalSalaryOfTheSelectedEmployee += employeePayitem.amount;
                      }
                }
          
              },(error: any) => {})
  
            }
  
            this.employeePayitemsList = res;
        }
  
      },(error: any) => {})
    }

    enableEditItem(assignedItem: any){
      this.editEnabledItemId = assignedItem.id;
      this.editEnabledItemValue = assignedItem.value;
      this.isEditEnabledItemInputsDisabled = false;
    }

    disableEditing(){
      this.editEnabledItemId = "";
      this.isEditEnabledItemInputsDisabled = true;
    }

    updateEditEnabledItemDetails(employeePayitemModel: any){
        this.isEditEnabledItemInputsDisabled = true;

        if(employeePayitemModel.id == this.editEnabledItemId){
          if(this.editEnabledItemValue < 0 || this.editEnabledItemValue === null || this.editEnabledItemValue === undefined){
            this._snackBar.open("Invalid or out of range value. Please recheck the details and try again.", "Dismiss", {duration: 5 * 1000});
            this.isEditEnabledItemInputsDisabled = false;
            return;
          }

          this._snackBar.open("Updating the assigned items...", "Dismiss", {duration: 5 * 1000});

          employeePayitemModel.value = this.editEnabledItemValue;

          this.employeePayitemService.updateEmployeePayItem(employeePayitemModel).subscribe((res: any) => {
            if(res){
              if(res.errorCode == "INVALID_INFOMARTION"){
                this.isEditEnabledItemInputsDisabled = false;
                this._snackBar.open(res.message, "Ok");
              }else{
                this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
                this.disableEditing();
                this.viewEmployeePaymentDetails(this.currentEmployee);
              }
            }
          },(error: any) => {
            this.isEditEnabledItemInputsDisabled = false;
            this._snackBar.open("Failed to update the assigned items.", "Ok");
          })
        }
    }

    removePayitemFromEmployee(id: any) {
      if (id){
        if (confirm('Are you sure you want to delete this pay item?')){
          this._snackBar.open("Removing the payitem...", "Dismiss", {duration: 5 * 1000});
          this.employeePayitemService.removePayItemFromEmployee(id).subscribe((res: any) => {
            if(res){
              this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
              this.viewEmployeePaymentDetails(this.currentEmployee);
            }
          },(error: any) => {
            this._snackBar.open("Failed to remove the payitem form the employee.", "Dismiss", {duration: 5 * 1000});
          })
        }
      }
    }

    displayAssignNewItemForm(){
        this.isDisplayAssignNewItemForm = true;
    }

    updateAssignItemInputFieldsWithSelectedItem(){
      const selectedPayitem = this.payItemsList.find(item => item.id === this.employeePayitemModel.payItemId);

      this.employeePayitemModel.payitem.itemType = selectedPayitem?.itemType ?? '';
      this.employeePayitemModel.payitem.paymentType = selectedPayitem?.paymentType ?? '';
    }

    resetAssignItemInputFields(){
      this.employeePayitemModel = new EmployeePayItemModel();
    }

    assignPayitem(){
      this._snackBar.open("Assigning the payitem...", "Dismiss", {duration: 5 * 1000});
      this.employeePayitemModel.email = this.currentEmployee.email;

      if(this.employeePayitemModel.payItemId == "" || this.employeePayitemModel.payItemId == null){
        this._snackBar.open("Please select an available pay item to assign.", "Dismiss", {duration: 5 * 1000});
        return
      }

      if(this.employeePayitemModel.type == "" || this.employeePayitemModel.type == null){
        this._snackBar.open("Please select a type for the pay item which is going to be assigned.", "Dismiss", {duration: 5 * 1000});
        return
      }

      if(this.employeePayitemModel.value < 0 || this.employeePayitemModel.value === null || this.employeePayitemModel.value === undefined){
        this._snackBar.open("Invalid or out of range value. Please recheck the details and try again.", "Dismiss", {duration: 5 * 1000});
        return;
      }

      this.employeePayitemService.assignPayItem(this.employeePayitemModel).subscribe((res: any) => {
        if(res){
          if(res.errorCode == "DUPLICATED_INFOMARTION"){
            this._snackBar.open(res.message, "Ok");
          }else{
            this.viewEmployeePaymentDetails(this.currentEmployee);
            this.resetAssignItemInputFields();
            this._snackBar.open(res.message, "Dismiss", {duration: 5 * 1000});
          }
        }
      },(error: any) => {
        this._snackBar.open("Failed to assign the payitem.", "Dismiss", {duration: 5 * 1000});
      })
    }
}
