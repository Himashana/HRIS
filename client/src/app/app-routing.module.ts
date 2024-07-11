import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {NotFoundComponent} from "./shared/components/not-found/not-found.component";
import {ProfileComponent} from "./shared/components/profile/profile.component";
import {FeedWrapperComponent} from "./components/feed-wrapper/feed-wrapper.component";
import {FeedComponent} from "./shared/components/feed/feed.component";
import {LogInComponent} from './components/login/login.component';
import {ChatListComponent} from "./shared/components/chat-list/chat-list.component";
import {AnnouncementAreaComponent} from "./shared/components/announcement-area/announcement-area.component";
import {ProfileAboutComponent} from "./shared/components/profile/profile-about/profile-about.component";
import {ProfilePostsComponent} from "./shared/components/profile/profile-posts/profile-posts.component";
import {ProfileActivityComponent} from "./shared/components/profile/profile-activity/profile-activity.component";
import {EmployeeRegisterComponent} from "./shared/components/employee-register/employee-register.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {EditProfileComponent} from "./shared/components/profile/edit-profile/edit-profile.component";
import {ChatAreaComponent} from "./shared/components/chat-area/chat-area.component";
import {PostComponent} from "./shared/components/post/post.component";
import {RequestsComponent} from "./components/requests/requests.component";
import {TransferRequestComponent} from "./components/requests/transfer-request/transfer-request.component";
import {PromotionRequestComponent} from "./components/requests/promotion-request/promotion-request.component";
import {AuthGuard} from "./guards/auth.guard";
import {EmployeeComponent} from "./components/employee/employee.component";
import {EmpDashboardComponent} from "./components/employee/emp-dashboard/emp-dashboard.component";
import {EmpTransferComponent} from "./components/employee/emp-transfer/emp-transfer.component";
import {EmpPromotionComponent} from "./components/employee/emp-promotion/emp-promotion.component";
import {BulletinsComponent} from "./components/bulletins/bulletins.component";
import {PayrollComponent} from "./components/payroll/payroll.component";
import {AddpayiteamsComponent} from './components/payroll/addpayiteams/addpayiteams.component';
import {EmployeeUpdateComponent} from "./shared/components/employee-update/employee-update.component";
import {OnboardingHandleComponent} from "./components/onboarding-handle/onboarding-handle.component";
import {AmLmComponent} from "./components/am-lm/am-lm.component";
import {AttendenceComponent} from "./components/am-lm/attendence/attendence.component";
import {LeaveComponent} from "./components/am-lm/leave/leave.component";
import {LeaveRequestComponent} from "./components/requests/leave-request/leave-request.component";
import {
  EmployeePaymentsComponent
} from './components/payroll/employee-payments/employee-payments/employee-payments.component';
import {
  ViewEmployeePayitemsComponent
} from './components/payroll/view-employee-payitems/view-employee-payitems/view-employee-payitems.component';
import {PayitemsComponent} from './components/payroll/payitems/payitems/payitems.component';
import {AssignPayitemComponent} from './components/payroll/assign-payitem/assign-payitem/assign-payitem.component';
import {ProfileAttendanceComponent} from "./shared/components/profile/profile-attendance/profile-attendance.component";
import {AssignTaskComponent} from "./components/onboarding-handle/assign-task/assign-task.component";
import {CreatePlanComponent} from "./components/onboarding-handle/create-plan/create-plan.component";
import {CreateTaskComponent} from "./components/onboarding-handle/create-task/create-task.component";
import {PayrollReportsComponent} from './components/payroll/payroll-reports/payroll-reports/payroll-reports.component';
import {
  ViewPayrollReportsComponent
} from './components/payroll/payroll-reports/view-payroll-reports/view-payroll-reports.component';
import {ShiftComponent} from "./components/am-lm/shift/shift.component";
import {PayrollHistoryComponent} from './components/payroll/payroll-reports/payroll-history/payroll-history.component';
import {MarkAttendanceComponent} from "./components/am-lm/mark-attendance/mark-attendance.component";
import {
  PayrollReportsOverviewComponent
} from './components/payroll/payroll-reports/payroll-reports-overview/payroll-reports-overview.component';
import {TaxdetailsComponent} from "./components/taxdetails/taxdetails.component";
import {AddNewTaxrangeComponent} from "./components/taxdetails/add-new-taxrange/add-new-taxrange.component";
import {AdminGuard} from "./guards/admin.guard";
import {RecruitmentComponent} from "./components/recruitment/recruitment.component";
import {
  RecruitmentApplicantsComponent
} from "./components/recruitment/recruitment-applicants/recruitment-applicants.component";
import {
  RecruitmentJobListComponent
} from "./components/recruitment/recruitment-job-list/recruitment-job-list.component";
import {DashboardInitialComponent} from "./components/Dashboards/dashboard-initial/dashboard-initial.component";
import {EventCalendarComponent} from "./shared/components/event-calendar/event-calendar.component";
import {
  DashboardMainComponent
} from "./components/Dashboards/dashboard-initial/dashboard-main/dashboard-main.component";
import {
  DashboardOnboardinMainComponent
} from "./components/Dashboards/dashboard-initial/dashboard-onboardin-main/dashboard-onboardin-main.component";
import { PayrollConfigurationComponent } from './components/payroll/payroll-configuration/payroll-configuration.component';
import { RunPayrollComponent } from './components/payroll/run-payroll/run-payroll.component';
import {ForbiddenComponent} from "./shared/components/forbidden/forbidden.component";
import {DashboardConfigComponent} from "./components/Dashboards/dashboard-config/dashboard-config.component";
import {ConfigGuard} from "./guards/config.guard";
import {HolidayCalendarComponent} from "./shared/components/holiday-calendar/holiday-calendar.component";
import {DecryptDataComponent} from "./temp/decrypt-data/decrypt-data.component";
import {UserSettingsComponent} from "./components/user-settings/user-settings.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {
    path: 'feed', component: FeedWrapperComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: '/feed/area', pathMatch: 'full'},
      {path: 'area', component: FeedComponent},
      {path: 'post/:postId', component: PostComponent},
      {path: 'chat/:id', component: ChatAreaComponent},
    ]
  },
  {path: 'chat-list', component: ChatListComponent, canActivate: [AuthGuard]},
  {path: 'news', component: AnnouncementAreaComponent, canActivate: [AuthGuard]},
  {
    path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: '/profile/:id/about/:id', pathMatch: 'full'},
      {path: 'about/:id', component: ProfileAboutComponent},
      {path: 'edit/:id', component: EditProfileComponent},
      {path: 'posts/:id', component: ProfilePostsComponent},
      {path: 'activity/:id', component: ProfileActivityComponent},
      {path: 'attendance/:id', component: ProfileAttendanceComponent},
    ]
  },
  {path: 'login', component: LogInComponent},
  {path: 'emp-register', component: EmployeeRegisterComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'emp-update/:id', component: EmployeeUpdateComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'bulletins', component: BulletinsComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'reset-password', component: ResetPasswordComponent},
  {
    path: 'requests/:id', component: RequestsComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: '/requests/:id/transfer/:id', pathMatch: 'full'},
      {path: 'transfer/:id', component: TransferRequestComponent},
      {path: 'promotion/:id', component: PromotionRequestComponent},
      {path: 'leave/:id', component: LeaveRequestComponent},
    ]
  },
  {
    path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard, AdminGuard], children: [
      {path: '', redirectTo: '/employee/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: EmpDashboardComponent},
      {path: 'transfer', component: EmpTransferComponent},
      {path: 'promotion', component: EmpPromotionComponent},
    ]
  },
  {
    path: 'alm', component: AmLmComponent, canActivate: [AuthGuard, AdminGuard], children: [
      {path: '', redirectTo: '/alm/attendance', pathMatch: 'full'},
      {path: 'attendance', component: AttendenceComponent},
      {path: 'leave', component: LeaveComponent},
      {path: 'shift', component: ShiftComponent},
      {path: 'mark-attendance', component: MarkAttendanceComponent}
    ]
  },
  {
    path: 'payroll', component: PayrollComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: '/payroll/employee-payments', pathMatch: 'full'},
      {path: 'employee-payments', component: EmployeePaymentsComponent},
      {path: 'employee/:id/payitems', component: ViewEmployeePayitemsComponent},
      {path: 'payitems', component: PayitemsComponent},
      {path: 'new-payitem', component: AddpayiteamsComponent},
      {path: 'edit-payitem/:payitemId', component: AddpayiteamsComponent},
      {path: 'assign-payitem/:payitemId', component: AssignPayitemComponent},
      {path: 'payroll-reports-overview', component: PayrollReportsOverviewComponent},
      {path: 'employee-payroll-reports', component: PayrollReportsComponent},
      {path: 'view-payroll-reports/:id', component: ViewPayrollReportsComponent},
      {path: 'payroll-history', component: PayrollHistoryComponent},
      {path: 'taxdetails', component: TaxdetailsComponent},
      {path: 'taxdetails/new-tax-detail', component: AddNewTaxrangeComponent},
      {path: 'taxdetails/edit-tax-detail/:taxdetailId', component: AddNewTaxrangeComponent},
      {path: 'payroll-configuration', component: PayrollConfigurationComponent},
      {path: 'run-payroll', component: RunPayrollComponent}
    ]
  },
  {
    path: 'onboardin', component: OnboardingHandleComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: '/onboardin/plan', pathMatch: "full"},
      {path: 'assign', component: AssignTaskComponent},
      {path: 'plan', component: CreatePlanComponent, canActivate: [AdminGuard]},
      {path: 'task', component: CreateTaskComponent},
    ]
  },
  {path: 'recruitment', component: RecruitmentComponent, canActivate: [AuthGuard, AdminGuard], children: [
    {path: '', redirectTo: '/recruitment/applicants', pathMatch: 'full'},
    {path: 'applicants', component: RecruitmentApplicantsComponent},
    {path: 'job-listing', component: RecruitmentJobListComponent},
  ]},
  {path: 'event-calendar', component: EventCalendarComponent, canActivate: [AuthGuard]},
  {path: 'holiday-calendar', component: HolidayCalendarComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'dashboard', component: DashboardInitialComponent, canActivate: [AuthGuard, AdminGuard], children: [
    {path: '', redirectTo: '/dashboard/main', pathMatch: 'full'},
    {path: 'main', component: DashboardMainComponent},
    {path: 'onboarding', component: DashboardOnboardinMainComponent, canActivate: [AuthGuard, AdminGuard]},
  ]},
  {path: 'config', component: DashboardConfigComponent, canActivate: [AuthGuard, ConfigGuard]},
  {path: 'settings', component: UserSettingsComponent},
  {path: 'temp', component: DecryptDataComponent},
  {path: '403', component: ForbiddenComponent},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
