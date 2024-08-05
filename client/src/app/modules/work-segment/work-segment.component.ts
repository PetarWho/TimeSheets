import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { CalendarComponent } from "../../shared/calendar/calendar.component";
import { LegendComponent } from "../../shared/legend/legend.component";
import { TableComponent } from "../../shared/table/table.component";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import WorkSegment from "../../models/workSegment";
import WorkSegmentType from "../../models/workSegmentType";
import { WorkSegmentService } from "../../core/services/work-segment.service";
import { WorkSegmentTypeService } from "../../core/services/work-segment-type.service";
import { ProjectService } from "../../core/services/project.service";
import { UserService } from "../../core/services/user.service";
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  switchMap,
} from "rxjs";
import workSegmentDTO from "../../models/data_transfer_objects/workSegmentDTO";
import { DialogComponent } from "../../shared/dialog/dialog.component";
import User from "../../models/user";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { AuthService } from "../../core/services/auth.service";
import { RoleEnum } from "../../models/enums/roles.enum";
import { PageEvent } from "@angular/material/paginator";
import { UserStatus } from "../../models/enums/user-status.enum";
import { ButtonComponent } from "../../shared/buttons/buttons.component";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Project } from "../../models/project";
import moment from "moment";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AutocompleteFilterComponent } from "../../shared/autocomplete-filter/autocomplete-filter.component";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
@Component({
  selector: "app-work-segment",
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    CalendarComponent,
    LegendComponent,
    TableComponent,
    PaginatorComponent,
    ButtonComponent,
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    AutocompleteFilterComponent,
  ],
  templateUrl: "./work-segment.component.html",
  styleUrls: ["./work-segment.component.css"],
  animations: [
    trigger("slideInFromLeft", [
      state("void", style({ transform: "translateX(-100%)", opacity: 0 })),
      state("*", style({ transform: "translateX(0)", opacity: 1 })),
      transition(":enter", [animate("0.7s ease-in")]),
    ]),
    trigger("slideInFromRight", [
      state("void", style({ transform: "translateX(100%)", opacity: 0 })),
      state("*", style({ transform: "translateX(0)", opacity: 1 })),
      transition(":enter", [animate("0.7s ease-in")]),
    ]),
  ],
})
export class WorkSegmentComponent implements OnInit {
  @ViewChild("workSegmentDialog")
  dialogComponent!: DialogComponent;
  legendsArray: WorkSegmentType[] = [];
  workSegments: WorkSegment[] = [];
  users: User[] = [];
  projects: Project[] = [];
  columns = [
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
  workSegmentForm: FormGroup;
  data: workSegmentDTO[] = [];
  isAdminOrManager!: boolean;
  totalWorkSegments: number = 0;
  currentPage = 0;
  pageSize = 10;
  workSegmentsCount!: number;
  selectedWorkSegment: WorkSegment | null = null;
  selectedWorkSegmentTypeId: bigint | undefined = undefined;
  isLoading = false;
  selectedDateRange: { startDate: Date; endDate: Date } | null = null;
  workSegmentTypes: WorkSegmentType[] = [];
  updatedWorkSegmentTypeId: bigint | undefined = undefined;
  usersNames: { name: string; id: bigint }[] = [];
  typesNames: { name: string; id: bigint }[] = [];
  projectsNames: { name: string; id: bigint }[] = [];
  typesNamesAutocomplete: { name: string; id: bigint }[] = [];
  usersNamesAutocomplete: { name: string; id: bigint }[] = [];
  projectsNamesAutocomplete: { name: string; id: bigint }[] = [];
  selectedUserId: bigint | null = null;
  selectedProjectId: bigint | null = null;
  selectedUserOption: { name: string; id: bigint } | null = null;
  selectedTypeOption: { name: string; id: bigint } | null = null;
  selectedProjectOption: { name: string; id: bigint } | null = null;

  showSnackBar(message: string, type: "success" | "error"): void {
    const config: MatSnackBarConfig = {
      duration: this.SNACKBAR_DURATION,
      panelClass: `snackbar-${type}`,
    };
    this.snackBar.open(message, "Close", config);
  }
  private readonly SNACKBAR_DURATION = 2000;
  private previousClickedTypeId: bigint | null = null;

  constructor(
    private fb: FormBuilder,
    private workSegmentService: WorkSegmentService,
    private workSegmentTypeService: WorkSegmentTypeService,
    private projectService: ProjectService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.workSegmentForm = this.fb.group({
      date: ["", Validators.required],
      hours: ["", Validators.required],
      notes: [""],
      user_id: ["", Validators.required],
      work_segment_type_id: ["", Validators.required],
      project_id: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkRole();
    this.loadWorkSegmentTypes();
    this.loadData();
    this.setupSearch();
  }

  loadData(): void {
    this.isLoading = true;
    const userId = this.userService.getUserIdFromToken() as number;

    if (!userId) {
      throw new Error("User not found!");
    }

    this.workSegmentService
      .getWorkSegmentsCount(
        this.selectedWorkSegmentTypeId,
        this.selectedDateRange
      )
      .then((count) => {
        this.workSegmentsCount = count || 0;
      });

    this.authService
      .getUserRole()
      .pipe(
        map(
          (role) =>
            role.name === RoleEnum.Admin || role.name === RoleEnum.Manager
        ),
        switchMap((isAdminOrManager) => {
          this.isAdminOrManager = isAdminOrManager;

          const workSegments$ = this.workSegmentService.getWorkSegments(
            this.currentPage,
            this.pageSize,
            this.selectedWorkSegmentTypeId,
            this.selectedDateRange
          );

          const workSegmentTypes$ =
            this.workSegmentTypeService.getWorkSegmentTypes(0, 10, null);

          return forkJoin({
            workSegments: workSegments$,
            workSegmentTypes: workSegmentTypes$,
          });
        })
      )
      .subscribe(({ workSegments: workSegments, workSegmentTypes }) => {
        this.legendsArray = workSegmentTypes;
        this.workSegments = workSegments || [];
        this.mapData();
        this.isLoading = false;
      });
  }

  mapData(): void {
    if (!Array.isArray(this.workSegments)) {
      throw new Error("workSegments is not an array");
    }

    const dataObservables = this.workSegments.map((segment) =>
      forkJoin({
        segment: of(segment),
        work_segment_type: this.workSegmentTypeService.getWorkSegmentTypeById(
          segment.work_segment_type_id
        ),
        user: this.userService.getUserById(segment.user_id),
        project: this.projectService.getProjectById(segment.project_id),
      })
    );

    if (dataObservables.length == 0) {
      this.data = [];
    } else {
      forkJoin(dataObservables).subscribe((results) => {
        this.data = results.map(
          ({ segment, work_segment_type, user, project }) => ({
            ...segment,
            work_segment_type_name: work_segment_type.name,
            user_name: user.name,
            project_name: project.name,
          })
        );
      });
    }
  }

  checkRole(): void {
    this.authService.getUserRole().subscribe((role) => {
      this.isAdminOrManager =
        role.name == RoleEnum.Admin || role.name == RoleEnum.Manager;
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  handleLegendClick(id: bigint | null): void {
    if (this.previousClickedTypeId === id) {
      this.selectedWorkSegmentTypeId = undefined;
      this.previousClickedTypeId = null;
    } else {
      this.previousClickedTypeId = id;

      if (!id) {
        this.selectedWorkSegmentTypeId = undefined;
        this.loadData();
      } else {
        this.workSegmentTypeService
          .getWorkSegmentTypeById(BigInt(id))
          .subscribe((type) => {
            this.selectedWorkSegmentTypeId = type.id;
            this.currentPage = 0;
            this.pageSize = 10;
            this.loadData();
          });
      }
    }
  }

  handleDateRangeChange(dateRange: { startDate: Date; endDate: Date }): void {
    this.selectedDateRange = dateRange;
    this.currentPage = 0;
    this.pageSize = 10;
    this.loadData();
  }

  getWorkSegmentButtons() {
    return [
      {
        label: "Save",
        onClick: () => this.confirmSaveWorkSegment(),
        class: "btn-save",
        shouldClose: false,
      },
      {
        label: "Delete",
        onClick: () => this.confirmDeleteWorkSegment(),
        class: "btn-delete",
        shouldClose: false,
      },
    ];
  }

  getAddSegmentButtons() {
    return [
      {
        label: "Create",
        onClick: () => this.addWorkSegment(),
        class: "btn-save",
        shouldClose: true,
      },
    ];
  }

  onWorkSegmentClick(workSegment: WorkSegment) {
    this.setupSearch();
    this.selectedWorkSegment = workSegment;
    this.selectedUserId = workSegment.user_id;
    if (workSegment.user_id && this.isAdminOrManager) {
      this.userService.getUserById(workSegment.user_id).subscribe((user) => {
        this.selectedUserId = workSegment.user_id;
        this.users = [user];
        this.selectedUserOption = {
          name: user.name,
          id: user.id,
        };
      });
    }

    if (workSegment.work_segment_type_id) {
      this.workSegmentTypeService
        .getWorkSegmentTypeById(workSegment.work_segment_type_id)
        .subscribe((type) => {
          this.selectedUserId = workSegment.user_id;
          this.workSegmentTypes = [type];
          this.selectedTypeOption = {
            name: type.name,
            id: type.id,
          };
        });
    }

    if (workSegment.project_id) {
      this.projectService
        .getProjectById(workSegment.project_id)
        .subscribe((project) => {
          this.selectedUserId = workSegment.user_id;
          this.projects = [project];
          this.selectedProjectOption = {
            name: project.name,
            id: project.id,
          };
        });
    }

    this.dialogComponent.openDialog();
  }

  saveWorkSegment() {
    if (this.selectedWorkSegment) {
      this.selectedWorkSegment.user_id = this.selectedUserId!;
      this.selectedWorkSegment.work_segment_type_id =
        this.updatedWorkSegmentTypeId!;
      this.selectedWorkSegment.project_id = this.selectedProjectId!;
      this.workSegmentService
        .updateWorkSegment(this.selectedWorkSegment)
        .subscribe(
          (response) => {
            this.showSnackBar("Successfully updated work segment", "success");
            this.dialogComponent.closeDialog();
            this.loadData();
          },
          (error) => {
            this.showSnackBar("Error updating work segment", "error");
          }
        );
    }
  }
  confirmSaveWorkSegment() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to save the changes?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveWorkSegment();
      }
    });
  }

  deleteWorkSegment() {
    if (this.selectedWorkSegment) {
      this.workSegmentService
        .deleteWorkSegment(this.selectedWorkSegment)
        .subscribe(
          (response) => {
            this.showSnackBar("Successfully deleted work segment", "success");
            this.loadData();
            this.selectedWorkSegment = null;
          },
          (error) => {
            this.showSnackBar("Error deleting work segment", "error");
          }
        );
    }
  }
  confirmDeleteWorkSegment() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want ot delete this work segment?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteWorkSegment();
        this.dialog.closeAll();
      }
    });
  }

  loadWorkSegmentTypes(): void {
    this.workSegmentTypeService.getWorkSegmentTypes(0, 10, null).subscribe(
      (types) => {
        this.workSegmentTypes = types;
      },
      (error) => {
        this.snackBar.open("Error fetching work segment types", "Close", {
          duration: this.SNACKBAR_DURATION,
        });
      }
    );
  }

  updateDate(event: string) {
    if (this.selectedWorkSegment) {
      this.selectedWorkSegment.date = new Date(event);
    }
  }

  updateHours(event: number) {
    if (this.selectedWorkSegment) {
      this.selectedWorkSegment.hours = event;
    }
  }

  setupSearch(): void {
    if (this.isAdminOrManager) {
      this.userService.getUsers(0, 10, UserStatus.Active, "").subscribe(
        (users) => {
          this.usersNames = users.map((user: User) => ({
            name: user.name,
            id: user.id,
          }));
        },
        (error) => {
          this.snackBar.open("Error fetching users", "Close", {
            duration: this.SNACKBAR_DURATION,
          });
        }
      );
    }

    this.workSegmentTypeService.getWorkSegmentTypes(0, 10, null).subscribe(
      (types) => {
        this.typesNames = types.map((type: WorkSegmentType) => ({
          name: type.name,
          id: type.id,
        }));
      },
      (error) => {
        this.snackBar.open("Error fetching work segment types", "Close", {
          duration: this.SNACKBAR_DURATION,
        });
      }
    );

    this.projectService.getAllProjects().subscribe(
      (projects) => {
        this.projectsNames = projects.map((project: Project) => ({
          name: project.name,
          id: project.id,
        }));
      },
      (error) => {
        this.snackBar.open("Error fetching projects", "Close", {
          duration: this.SNACKBAR_DURATION,
        });
      }
    );
  }

  loadTypeData(filter: string): void {
    this.workSegmentTypeService.getWorkSegmentTypes(0, 10, filter).subscribe(
      (typesAutocomplete) => {
        this.typesNamesAutocomplete = typesAutocomplete.map(
          (workSegmentType: WorkSegmentType) => ({
            name: workSegmentType.name,
            id: workSegmentType.id,
          })
        );
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching work segment type data", error);
        this.snackBar.open("Error fetching work segment type data", "Close", {
          duration: this.SNACKBAR_DURATION,
        });
      }
    );
  }

  loadUserData(filter: string): void {
    this.userService.getUsers(0, 10, UserStatus.Active, filter).subscribe(
      (usersAutocomplete) => {
        this.usersNamesAutocomplete = usersAutocomplete.map((user: User) => ({
          name: user.name,
          id: user.id,
        }));
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching user data", error);
        this.snackBar.open("Error fetching user data", "Close", {
          duration: this.SNACKBAR_DURATION,
        });
      }
    );
  }

  loadProjectData(filter: string): void {
    this.projectService.getAllProjects(0, 10, filter).subscribe(
      (projectsAutocomplete) => {
        this.projectsNamesAutocomplete = projectsAutocomplete.map(
          (project: Project) => ({
            name: project.name,
            id: project.id,
          })
        );
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching project data", error);
        this.snackBar.open("Error fetching project data", "Close", {
          duration: this.SNACKBAR_DURATION,
        });
      }
    );
  }

  onTypeInputChanged(filter: string) {
    this.loadTypeData(filter);
  }

  onUserInputChanged(filter: string) {
    this.loadUserData(filter);
  }

  onProjectInputChanged(filter: string) {
    this.loadProjectData(filter);
  }

  displayOption(option: { name: string; id: bigint }): string {
    return option ? option.name : "";
  }

  onUserSelected(option: { name: string; id: bigint }): void {
    this.selectedUserId = option.id;
    this.workSegmentForm.get("user_id")?.setValue(option.id);
  }

  onProjectSelected(option: { name: string; id: bigint }): void {
    this.selectedProjectId = option.id;
    this.workSegmentForm.get("project_id")?.setValue(option.id);
  }

  onTypeSelected(option: { name: string; id: bigint }): void {
    this.updatedWorkSegmentTypeId = option.id;
    this.workSegmentForm.get("work_segment_type_id")?.setValue(option.id);
  }

  addWorkSegment() {
    if (this.workSegmentForm.valid) {
      const workSegment = this.workSegmentForm.value;

      workSegment.start_date = moment.utc(workSegment.start_date).toDate();
      workSegment.end_date = moment.utc(workSegment.end_date).toDate();

      this.workSegmentService.createWorkSegment(workSegment).subscribe(
        (response) => {
          this.snackBar.open("Work Segment created successfully", "Close", {
            duration: this.SNACKBAR_DURATION,
          });
          this.loadData();
          this.workSegmentForm.reset();
          this.dialogComponent.closeDialog();
        },
        (error) => {
          this.snackBar.open("Error creating work segment", "Close", {
            duration: this.SNACKBAR_DURATION,
          });
        }
      );
    } else {
      this.snackBar.open("Invalid data. Please fill all the inputs!", "Close", {
        duration: this.SNACKBAR_DURATION,
      });
    }
  }
}
