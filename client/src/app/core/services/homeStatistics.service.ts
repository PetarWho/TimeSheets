import { WorkSegmentService } from "./work-segment.service";
import { LeaveSegmentService } from "./leave-segment.service";
import { TeamService } from "./team.service";
import { ProjectService } from "./project.service";
import HomeStatisticsData from "../../models/homeStatisticsData";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export default class HomeStatisticsService {
  constructor(
    private workSegmentService: WorkSegmentService,
    private leaveSegmentService: LeaveSegmentService,
    private teamService: TeamService,
    private projectService: ProjectService
  ) {}

  async getStatisticsData(
    dateRange: {
      startDate: Date;
      endDate: Date;
    } | null
  ): Promise<HomeStatisticsData[]> {
    let workSegmentsCount = 0;
    let leaveSegmentsCount = 0;
    let teamsCount = 0;
    let projectsCount = 0;

    await this.workSegmentService
      .getWorkSegmentsCount(undefined, dateRange)
      .then((count) => (workSegmentsCount = count as number));

    await this.leaveSegmentService
      .getLeaveSegmentsCount(undefined, dateRange)
      .then((count) => (leaveSegmentsCount = count as number));

    await this.teamService
      .getTeamsCount(dateRange)
      .then((count) => (teamsCount = count as number));

    await this.projectService.getProjectsCount(dateRange).then((count) => {
      projectsCount = count as number;
    });

    return [
      { name: "Work Segments", value: workSegmentsCount },
      { name: "Leave Segments", value: leaveSegmentsCount },
      { name: "Teams", value: teamsCount },
      { name: "Projects", value: projectsCount },
    ];
  }
}
