import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ButtonComponent } from "../../../../shared/buttons/buttons.component";
import { CalendarComponent } from "../../../../shared/calendar/calendar.component";
import WorkSegment from "../../../../models/workSegment";
import LeaveSegment from "../../../../models/leaveSegment";
import { SegmentType } from "../../../../models/enums/segment-type.enum";
import { WorkSegmentService } from "../../../../core/services/work-segment.service";
import { LeaveSegmentService } from "../../../../core/services/leave-segment.service";
import { UserService } from "../../../../core/services/user.service";
import { TableComponent } from "../../../../shared/table/table.component";
import { forkJoin, of } from "rxjs";
import workSegmentDTO from "../../../../models/data_transfer_objects/workSegmentDTO";
import LeaveSegmentDTO from "../../../../models/data_transfer_objects/leaveSegmentDTO";
import { WorkSegmentTypeService } from "../../../../core/services/work-segment-type.service";
import { LeaveSegmentTypeService } from "../../../../core/services/leave-segment-type.service";
import { ProjectService } from "../../../../core/services/project.service";
import { CommonModule } from "@angular/common";

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
interface WorkSegmentColumns {
  key: string;
  header: string;
  sortDescription: string;
  type?: string;
}

interface LeaveSegmentColums {
  key: string;
  header: string;
  sortDescription: string;
  type?: string;
}

@Component({
  selector: "app-home-user-template",
  standalone: true,
  imports: [ButtonComponent, CalendarComponent, TableComponent, CommonModule],
  templateUrl: "./home-user-template.component.html",
  styleUrls: ["./home-user-template.component.css"],
  animations: [
    trigger("slideInFromBottom", [
      state("void", style({ transform: "translateY(100%)", opacity: 0 })),
      state("*", style({ transform: "translateY(0)", opacity: 1 })),
      transition(":enter", [animate("0.7s ease-in")]),
    ]),
  ],
})
export class HomeUserTemplateComponent implements OnInit {
  currentDate!: string;
  workSegments: WorkSegment[] = [];
  leaveSegments: LeaveSegment[] = [];
  isWorkSegmentSelected: boolean = true;
  SegmentType = SegmentType;
  workSegmentData: workSegmentDTO[] = [];
  leaveSegmentData: LeaveSegmentDTO[] = [];
  selectedSegmentType: SegmentType = SegmentType.WorkSegment;
  workSegmentColumns: WorkSegmentColumns[] = [];
  leaveSegmentColumns: LeaveSegmentColums[] = [];
  totalLeaveSegments: number = 0;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private userService: UserService,
    private workSegmentService: WorkSegmentService,
    private leaveSegmentService: LeaveSegmentService,
    private leaveSegmentTypeService: LeaveSegmentTypeService,
    private workSegmentTypeService: WorkSegmentTypeService,
    private projectService: ProjectService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.currentDate = today.toDateString();
    this.generateTable();
    this.loadSegments();
  }

  onSegmentTypeChange(event: Event): void {
    const value: string = (event.target as HTMLSelectElement).value;
    const segmentType: SegmentType =
      SegmentType[value as keyof typeof SegmentType];
    this.isWorkSegmentSelected = segmentType == SegmentType.WorkSegment;
    this.selectedSegmentType = segmentType;

    this.loadSegments();
  }

  loadSegments() {
    const userId = this.userService.getUserIdFromToken();
    if (!userId) {
      throw new Error("User not found!");
    }

    this.workSegmentService
      .getWorkSegmentsByUserId(userId, 0, 10)
      .subscribe((segments) => (this.workSegments = segments));
    this.leaveSegmentService
      .getLeaveSegments(this.currentPage, this.pageSize, undefined, null)
      .subscribe((segments) => (this.leaveSegments = segments));

    this.loadData();
  }

  loadData(): void {
    const userId = this.userService.getUserIdFromToken() as number;

    if (!userId) {
      throw new Error("User not found!");
    }
    forkJoin({
      workSegments: this.workSegmentService.getWorkSegmentsByUserId(
        userId,
        0,
        10
      ),
    }).subscribe(({ workSegments }) => {
      this.workSegments = workSegments || [];
      this.mapData();
    });
    forkJoin({
      leaveSegments: this.leaveSegmentService.getLeaveSegments(
        this.currentPage,
        this.pageSize,
        undefined,
        null
      ),
      leaveSegmentTypes: this.leaveSegmentTypeService.getLeaveSegmentTypes(
        0,
        10,
        null
      ),
    }).subscribe(({ leaveSegments: leaveSegments }) => {
      this.leaveSegments = leaveSegments || [];
      this.mapData();
    });
  }

  mapData(): void {
    const workSegmentDataObservables = this.workSegments.map((segment) =>
      forkJoin({
        segment: of(segment),
        project: this.projectService.getProjectById(segment.project_id),
        work_segment_type: this.workSegmentTypeService.getWorkSegmentTypeById(
          segment.work_segment_type_id
        ),
        user: this.userService.getUserById(segment.user_id),
      })
    );

    forkJoin(workSegmentDataObservables).subscribe((results) => {
      this.workSegmentData = results.map(
        ({ segment, project, work_segment_type, user }) => ({
          ...segment,
          project_name: project.name,
          work_segment_type_name: work_segment_type.name,
          user_name: user.name,
        })
      );
    });

    const leaveSegmentDataObservables = this.leaveSegments.map((segment) =>
      forkJoin({
        segment: of(segment),
        leave_segment_type:
          this.leaveSegmentTypeService.getLeaveSegmentTypeById(
            segment.leave_segment_type_id
          ),
        user: this.userService.getUserById(segment.user_id),
      })
    );

    forkJoin(leaveSegmentDataObservables).subscribe((results) => {
      this.leaveSegmentData = results.map(
        ({ segment, leave_segment_type, user }) => ({
          ...segment,
          leave_segment_type_name: leave_segment_type.name,
          user_name: user.name,
        })
      );
    });
  }

  generateTable() {
    this.workSegmentColumns = [
      {
        key: "date",
        header: "Date",
        sortDescription: "Sort by date",
        type: "date",
      },
      {
        key: "hours",
        header: "Working hours",
        type: "number",
        sortDescription: "Sort by working hours",
      },
      {
        key: "project_name",
        header: "Project",
        sortDescription: "Sort by project",
      },
      {
        key: "work_segment_type_name",
        header: "Type",
        sortDescription: "Sort by type",
      },
      { key: "user_name", header: "User", sortDescription: "Sort by user" },
    ];

    this.leaveSegmentColumns = [
      {
        key: "start_date",
        header: "Start Date",
        sortDescription: "Sort by start date",
        type: "date",
      },
      {
        key: "end_date",
        header: "End Date",
        sortDescription: "Sort by end date",
        type: "date",
      },
      {
        key: "leave_segment_type_name",
        header: "Type",
        sortDescription: "Sort by type",
      },
      { key: "user_name", header: "User", sortDescription: "Sort by user" },
    ];

    this.changeDetectorRef.detectChanges();
  }
}
