import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { CalendarComponent } from "../../shared/calendar/calendar.component";
import { LegendComponent } from "../../shared/legend/legend.component";
import { TableComponent } from "../../shared/table/table.component";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import LeaveSegment from "../../models/leaveSegment";
import LeaveSegmentType from "../../models/leaveSegmentType";
import { LeaveSegmentService } from "../../core/services/leave-segment.service";
import { LeaveSegmentTypeService } from "../../core/services/leave-segment-type.service";
import { UserService } from "../../core/services/user.service";
import { forkJoin, map, of, switchMap } from "rxjs";
import LeaveSegmentDTO from "../../models/data_transfer_objects/leaveSegmentDTO";
import { AuthService } from "../../core/services/auth.service";
import { RoleEnum } from "../../models/enums/roles.enum";
import { PageEvent } from "@angular/material/paginator";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../shared/buttons/buttons.component";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { DialogComponent } from "../../shared/dialog/dialog.component";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import User from "../../models/user";
import { UserStatus } from "../../models/enums/user-status.enum";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import moment from "moment";
import { AutocompleteFilterComponent } from "../../shared/autocomplete-filter/autocomplete-filter.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { startDateBeforeEndDateValidator } from "../../core/functions/validators/startDateBeforeEndDateValidator";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

@Component({
  selector: "app-leave-segment",
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
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    AutocompleteFilterComponent,
    MatAutocompleteModule,
  ],
  templateUrl: "./leave-segment.component.html",
  styleUrls: ["./leave-segment.component.css"],
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
export class LeaveSegmentComponent implements OnInit {
  @ViewChild("leaveSegmentDialog") dialogComponent!: DialogComponent;

  legendsArray: LeaveSegmentType[] = [];
  leaveSegments: LeaveSegment[] = [];
  users: User[] = [];
  columns = [
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
  leaveSegmentForm: FormGroup;
  data: LeaveSegmentDTO[] = [];
  isAdminOrManager!: boolean;
  totalLeaveSegments: number = 0;
  currentPage = 0;
  pageSize = 10;
  leaveSegmentsCount!: number;
  selectedLeaveSegment: LeaveSegment | null = null;
  selectedLeaveSegmentTypeId: bigint | undefined = undefined;
  updatedLeaveSegmentTypeId: bigint | undefined = undefined;
  isLoading = false;
  selectedDateRange: { startDate: Date; endDate: Date } | null = null;
  leaveSegmentTypes: LeaveSegmentType[] = [];
  usersNames: { name: string; id: bigint }[] = [];
  usersNamesAutocomplete: { name: string; id: bigint }[] = [];
  typesNames: { name: string; id: bigint }[] = [];
  typesNamesAutocomplete: { name: string; id: bigint }[] = [];
  selectedUserId: bigint | null = null;
  selectedUserOption: { name: string; id: bigint } | null = null;
  selectedTypeOption: { name: string; id: bigint } | null = null;

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
    private leaveSegmentService: LeaveSegmentService,
    private leaveSegmentTypeService: LeaveSegmentTypeService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.leaveSegmentForm = this.fb.group(
      {
        start_date: ["", Validators.required],
        end_date: ["", Validators.required],
        notes: [""],
        user_id: ["", Validators.required],
        leave_segment_type_id: ["", Validators.required],
      },
      { validators: startDateBeforeEndDateValidator() }
    );
  }

  ngOnInit(): void {
    this.loadLeaveSegmentTypes();
    this.loadData();
    this.setupSearch();
  }

  loadData(): void {
    this.isLoading = true;
    const userId = this.userService.getUserIdFromToken() as number;

    if (!userId) {
      throw new Error("User not found!");
    }

    this.leaveSegmentService
      .getLeaveSegmentsCount(
        this.selectedLeaveSegmentTypeId,
        this.selectedDateRange
      )
      .then((count) => {
        this.leaveSegmentsCount = count || 0;
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

          const leaveSegments$ = this.leaveSegmentService.getLeaveSegments(
            this.currentPage,
            this.pageSize,
            this.selectedLeaveSegmentTypeId,
            this.selectedDateRange
          );

          const leaveSegmentTypes$ =
            this.leaveSegmentTypeService.getLeaveSegmentTypes(0, 10, null);

          return forkJoin({
            leaveSegments: leaveSegments$,
            leaveSegmentTypes: leaveSegmentTypes$,
          });
        })
      )
      .subscribe(({ leaveSegments, leaveSegmentTypes }) => {
        this.legendsArray = leaveSegmentTypes;
        this.leaveSegments = leaveSegments || [];
        this.mapData();
        this.isLoading = false;
      });
  }

  mapData(): void {
    if (!Array.isArray(this.leaveSegments)) {
      throw new Error("leaveSegments is not an array");
    }

    const dataObservables = this.leaveSegments.map((segment) =>
      forkJoin({
        segment: of(segment),
        leave_segment_type:
          this.leaveSegmentTypeService.getLeaveSegmentTypeById(
            segment.leave_segment_type_id
          ),
        user: this.userService.getUserById(segment.user_id),
      })
    );

    if (dataObservables.length == 0) {
      this.data = [];
    } else {
      forkJoin(dataObservables).subscribe((results) => {
        this.data = results.map(({ segment, leave_segment_type, user }) => ({
          ...segment,
          leave_segment_type_name: leave_segment_type.name,
          user_name: user.name,
        }));
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  handleLegendClick(id: bigint | null): void {
    if (this.previousClickedTypeId === id) {
      this.selectedLeaveSegmentTypeId = undefined;
      this.previousClickedTypeId = null;
    } else {
      this.previousClickedTypeId = id;

      if (!id) {
        this.selectedLeaveSegmentTypeId = undefined;
        this.loadData();
      } else {
        this.leaveSegmentTypeService
          .getLeaveSegmentTypeById(BigInt(id))
          .subscribe((type) => {
            this.selectedLeaveSegmentTypeId = type.id;
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

  getLeaveSegmentButtons() {
    return [
      {
        label: "Save",
        onClick: () => this.confirmSaveLeaveSegment(),
        class: "btn-save",
        shouldClose: false,
      },
      {
        label: "Delete",
        onClick: () => this.confirmDeleteLeaveSegment(),
        class: "btn-delete",
        shouldClose: false,
      },
    ];
  }

  getAddSegmentButtons() {
    return [
      {
        label: "Create",
        onClick: () => this.addLeaveSegment(),
        class: "btn-save",
        shouldClose: true,
      },
    ];
  }

  onLeaveSegmentClick(leaveSegment: LeaveSegment): void {
    this.setupSearch();
    let userId = leaveSegment.user_id;
    if (this.isAdminOrManager) {
      this.userService.getUserById(BigInt(userId)).subscribe((user) => {
        this.users = [user];
        this.selectedUserOption = {
          name: user.name,
          id: user.id,
        };
      });
    } else {
      this.selectedUserId = BigInt(this.authService.decodeToken().id);
    }

    this.selectedLeaveSegment = leaveSegment;
    this.selectedUserId = leaveSegment.user_id;
    if (leaveSegment.user_id && this.isAdminOrManager) {
      this.userService.getUserById(leaveSegment.user_id).subscribe((user) => {
        this.users = [user];
        this.selectedUserOption = {
          name: user.name,
          id: user.id,
        };
      });
    }

    if (leaveSegment.user_id) {
      this.leaveSegmentTypeService
        .getLeaveSegmentTypeById(leaveSegment.leave_segment_type_id)
        .subscribe((type) => {
          this.leaveSegmentTypes = [type];
          this.selectedTypeOption = {
            name: type.name,
            id: type.id,
          };
        });
    }

    this.dialogComponent.openDialog();
  }

  saveLeaveSegment() {
    if (this.selectedLeaveSegment) {
      this.selectedLeaveSegment.user_id = this.selectedUserId!;
      this.selectedLeaveSegment.leave_segment_type_id =
        this.updatedLeaveSegmentTypeId!;
      this.leaveSegmentService
        .updateLeaveSegment(this.selectedLeaveSegment)
        .subscribe(
          (response) => {
            this.showSnackBar("Successfully updated leave segment", "success");
            this.loadData();
            this.dialogComponent.closeDialog();
          },
          (error) => {
            this.showSnackBar("Error updating leave segment", "error");
          }
        );
    }
  }
  confirmSaveLeaveSegment() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to save the changes?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveLeaveSegment();
      }
    });
  }

  deleteLeaveSegment() {
    if (this.selectedLeaveSegment) {
      this.leaveSegmentService
        .deleteLeaveSegment(this.selectedLeaveSegment)
        .subscribe(
          (response) => {
            this.showSnackBar("Successfully deleted leave segment", "success");
            this.loadData();
            this.dialogComponent.closeDialog();
          },
          (error) => {
            this.showSnackBar("Error deleting leave segment", "error");
          }
        );
    }
  }
  confirmDeleteLeaveSegment() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to delete this Leave Segment?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteLeaveSegment();
        this.dialog.closeAll();
      }
    });
  }
  loadLeaveSegmentTypes(): void {
    this.leaveSegmentTypeService.getLeaveSegmentTypes(0, 10, null).subscribe(
      (types) => {
        this.leaveSegmentTypes = types;
      },
      (error) => {
        this.snackBar.open("Error fetching leave segment types", "Close", {
          duration: this.SNACKBAR_DURATION,
        });
      }
    );
  }

  updateStartDate(event: string) {
    if (this.selectedLeaveSegment) {
      this.selectedLeaveSegment.start_date = new Date(event);
    }
  }

  updateEndDate(event: string) {
    if (this.selectedLeaveSegment) {
      this.selectedLeaveSegment.end_date = new Date(event);
    }
  }

  setupSearch(): void {
    this.authService.getUserRole().subscribe((role) => {
      this.isAdminOrManager =
        role.name == RoleEnum.Admin || role.name == RoleEnum.Manager;

      if (this.isAdminOrManager) {
        this.userService.getUsers(0, 10, UserStatus.Active, null).subscribe(
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
      } else {
        this.leaveSegmentForm
          .get("user_id")
          ?.setValue(this.selectedLeaveSegment?.user_id);
      }
    });

    this.leaveSegmentTypeService.getLeaveSegmentTypes(0, 10, null).subscribe(
      (types) => {
        this.typesNames = types.map((type: LeaveSegmentType) => ({
          name: type.name,
          id: type.id,
        }));
      },
      (error) => {
        this.snackBar.open("Error fetching leave segment types", "Close", {
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

  loadTypeData(filter: string): void {
    this.leaveSegmentTypeService.getLeaveSegmentTypes(0, 10, filter).subscribe(
      (typesAutocomplete) => {
        this.typesNamesAutocomplete = typesAutocomplete.map(
          (leaveSegmentType: LeaveSegmentType) => ({
            name: leaveSegmentType.name,
            id: leaveSegmentType.id,
          })
        );
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching leave segment type data", error);
        this.snackBar.open("Error fetching leave segment type data", "Close", {
          duration: this.SNACKBAR_DURATION,
        });
      }
    );
  }

  onUserInputChanged(filter: string) {
    this.loadUserData(filter);
  }

  onTypeInputChanged(filter: string) {
    this.loadTypeData(filter);
  }

  displayOption(option: { name: string; id: bigint }): string {
    return option ? option.name : "";
  }

  onUserSelected(option: { name: string; id: bigint }): void {
    this.selectedUserId = option.id;
    this.leaveSegmentForm.get("user_id")?.setValue(option.id);
  }

  onTypeSelected(option: { name: string; id: bigint }): void {
    this.updatedLeaveSegmentTypeId = option.id;
    this.leaveSegmentForm.get("leave_segment_type_id")?.setValue(option.id);
  }

  addLeaveSegment() {
    if (!this.isAdminOrManager) {
      this.leaveSegmentForm
        .get("user_id")
        ?.setValue(this.authService.decodeToken().id);
    }

    if (this.leaveSegmentForm.valid) {
      const leaveSegment = this.leaveSegmentForm.value;

      leaveSegment.start_date = moment.utc(leaveSegment.start_date).toDate();
      leaveSegment.end_date = moment.utc(leaveSegment.end_date).toDate();

      this.leaveSegmentService.createLeaveSegment(leaveSegment).subscribe(
        (response) => {
          this.snackBar.open("Leave Segment created successfully", "Close", {
            duration: this.SNACKBAR_DURATION,
          });
          this.loadData();
          this.leaveSegmentForm.reset();
        },
        (error) => {
          this.snackBar.open("Error creating leave segment", "Close", {
            duration: this.SNACKBAR_DURATION,
          });
        }
      );
    } else {
      this.snackBar.open("Invalid data. Please check your inputs!", "Close", {
        duration: this.SNACKBAR_DURATION,
      });
    }
  }
}
