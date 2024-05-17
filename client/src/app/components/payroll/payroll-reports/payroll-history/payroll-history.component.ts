import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { PayrollReportService } from 'src/app/services/payroll-report.service';
import { SummaryReportService } from 'src/app/services/summary-report.service';
import { PayrollReportModel } from 'src/app/shared/data-models/payroll-report.model';

@Component({
  selector: 'app-payroll-history',
  templateUrl: './payroll-history.component.html',
  styleUrls: ['./payroll-history.component.scss']
})
export class PayrollHistoryComponent {

  summaryReportsTableColumns: string[] = ['reportType', 'payPeriod', 'totalEarnings', 'totalDeductions', 'netPayTotal', 'reportGeneratedDate', 'status'];
  summaryReportsTabledataSource = new MatTableDataSource<PayrollReportModel>([]);
  
  isEmployee = false;

  constructor(private dialog: MatDialog,
    private payrollReportsService: PayrollReportService,
    private employeesService: EmployeesService,
    private route: ActivatedRoute,
    private summaryReportService: SummaryReportService,
    private cookieService: AuthService
  ){}

  ngOnInit(): void {
      this.viewAllSummaryReports();
  }

  viewAllSummaryReports(){

    this.summaryReportService.getAllSummaryReportsByOrganizationId(this.cookieService.organization()).subscribe((res:any) =>{
      if(res){
        this.summaryReportsTabledataSource.data = res;
      }

    },(error: any) => {})
  }
}
