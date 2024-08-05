import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";
import { Role } from "../../models/role";
import { HomeAdminTemplateComponent } from "./templates/home-admin-template/home-admin-template.component";
import { HomeUserTemplateComponent } from "./templates/home-user-template/home-user-template.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    HomeAdminTemplateComponent,
    HomeUserTemplateComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  isAdminOrManagerView: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserRole().subscribe((role: Role) => {
      this.isAdminOrManagerView =
        role.name.toLowerCase() == "manager" ||
        role.name.toLowerCase() == "admin";

      if (!this.isAdminOrManagerView) {
        this.router.navigate(["/work-segments"]);
      }
    });
  }
}
