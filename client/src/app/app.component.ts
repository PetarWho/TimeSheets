import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { GoogleAuthService } from "./core/services/google-auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(private googleService: GoogleAuthService) {}
  title = "TimeSheets";
  ngOnInit(): void {
    this.googleService.setupGoogleLogin((res) => {});
  }
}
