import { Routes } from "@angular/router";
import { LoginComponent } from "./modules/login/login.component";
import { SignUpComponent } from "./modules/sign-up/sign-up.component";
import { ProfileComponent } from "./shared/profile/profile.component";
import { LeaveSegmentComponent } from "./modules/leave-segment/leave-segment.component";
import { HomeComponent } from "./modules/home/home.component";
import { TeamsComponent } from "./modules/teams/teams.component";
import { EmployeeComponent } from "./modules/employee/employee.component";
import { WorkSegmentComponent } from "./modules/work-segment/work-segment.component";
import { ProjectsComponent } from "./modules/projects/projects.component";
import { RoleGuard } from "./core/functions/roleGuard";
import { RoleEnum } from "./models/enums/roles.enum";

export const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "profile", component: ProfileComponent },
  { path: "projects", component: ProjectsComponent },
  { path: "leave-segments", component: LeaveSegmentComponent },
  {
    path: "employees",
    component: EmployeeComponent,
    canActivate: [RoleGuard],
    data: { roles: [RoleEnum.Admin] },
  },
  { path: "work-segments", component: WorkSegmentComponent },
  { path: "teams", component: TeamsComponent },
  { path: "projects", component: ProjectsComponent },
  { path: "**", component: HomeComponent },
];
