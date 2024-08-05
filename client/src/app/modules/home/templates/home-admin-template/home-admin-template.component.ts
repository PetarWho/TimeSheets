import { Component, OnInit } from "@angular/core";
import { Color, NgxChartsModule, ScaleType } from "@swimlane/ngx-charts";
import HomeStatisticsService from "../../../../core/services/homeStatistics.service";
import { ButtonComponent } from "../../../../shared/buttons/buttons.component";
import { MatCardModule } from "@angular/material/card";
import { CalendarComponent } from "../../../../shared/calendar/calendar.component";
import HomeStatisticsData from "../../../../models/homeStatisticsData";
import { StatisticsDataType } from "../../../../models/enums/statisticsDataTypes.enum";
import HomeStatisticsCardData from "../../../../models/homeStatisticsCardData";
import { Router } from "@angular/router";
import { LeaveSegmentService } from "../../../../core/services/leave-segment.service";

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
@Component({
  selector: "app-home-admin-template",
  standalone: true,
  imports: [ButtonComponent, CalendarComponent, NgxChartsModule, MatCardModule],
  templateUrl: "./home-admin-template.component.html",
  styleUrl: "./home-admin-template.component.css",
  animations: [
    trigger("slideInFromBottom", [
      state("void", style({ transform: "translateY(100%)", opacity: 0 })),
      state("*", style({ transform: "translateY(0)", opacity: 1 })),
      transition(":enter", [animate("0.7s ease-in")]),
    ]),
  ],
})
export class HomeAdminTemplateComponent implements OnInit {
  statisticsData: HomeStatisticsData[] = [];
  statisticsCardData: HomeStatisticsCardData = new HomeStatisticsCardData();
  view: [number, number] = [900, 600];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Type";
  showYAxisLabel = true;
  yAxisLabel = "Count";
  workIconPath: string;
  leaveIconPath: string;
  teamsIconPath: string;
  projectIconPath: string;

  colorScheme: Color = {
    name: "chartColorScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#1E7E27", "#FF6633", "#57BDB1", "#D25A61"],
  };
  constructor(
    private router: Router,
    private statisticsService: HomeStatisticsService
  ) {
    this.workIconPath = "../../../../../assets/images/work.svg";
    this.leaveIconPath = "../../../../../assets/images/leave.svg";
    this.teamsIconPath = "../../../../../assets/images/teams.svg";
    this.projectIconPath = "../../../../../assets/images/project.svg";
  }

  ngOnInit(): void {
    this.loadStatistics(null);
  }

  onSelect(event: any) {
    console.log(event);
  }

  private async loadStatistics(
    dateRange: { startDate: Date; endDate: Date } | null
  ) {
    this.statisticsData =
      await this.statisticsService.getStatisticsData(dateRange);

    for (const stat of this.statisticsData) {
      switch (stat.name) {
        case StatisticsDataType.WorkSegments:
          this.statisticsCardData.workSegmentsCount = stat.value;
          break;
        case StatisticsDataType.LeaveSegments:
          this.statisticsCardData.leaveSegmentsCount = stat.value;
          break;
        case StatisticsDataType.Team:
          this.statisticsCardData.teamsCount = stat.value;
          break;
        case StatisticsDataType.Projects:
          this.statisticsCardData.projectsCount = stat.value;
          break;
        default:
          break;
      }
    }
  }

  navigateTo(target: string) {
    this.router.navigate([target]);
  }

  handleDateRangeChange(dateRange: { startDate: Date; endDate: Date }): void {
    this.loadStatistics(dateRange);
  }
}
