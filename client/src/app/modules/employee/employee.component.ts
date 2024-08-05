import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TableComponent } from "../../shared/table/table.component";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { UserService } from "../../core/services/user.service";
import { DialogComponent } from "../../shared/dialog/dialog.component";
import User from "../../models/user";
import { Role } from "../../models/role";
import { UserStatus } from "../../models/enums/user-status.enum";
import { PageEvent } from "@angular/material/paginator";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-employee",
  standalone: true,
  imports: [
    TableComponent,
    FormsModule,
    CommonModule,
    PaginatorComponent,
    NavbarComponent,
    DialogComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.css"],
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
export class EmployeeComponent implements OnInit {
  @ViewChild("employeeTemplate", { static: true })
  employeeTemplate!: TemplateRef<any>;

  users: User[] = [];
  roles: Role[] = [];
  currentPage = 0;
  pageSize = 10;
  usersCount!: number;
  searchText = "";
  totalUsers: number = 0;
  selectedUser: User | null = null;
  updatedUser: User | null = null;
  selectedRole: Role | null = null;
  statusFilter: UserStatus = UserStatus.All;

  columns = [
    {
      key: "name",
      header: "Name",
      sortDescription: "Sort by name",
    },
    {
      key: "email",
      header: "Email",
      sortDescription: "Sort by email",
    },
    {
      key: "status",
      header: "Status",
      sortDescription: "Sort by status",
    },
    {
      key: "created_at",
      header: "Date of Creation",
      sortDescription: "Sort by creation date",
      type: "date",
    },
  ];

  UserStatus = UserStatus;
  showSnackBar(message: string, type: "success" | "error"): void {
    const config: MatSnackBarConfig = {
      duration: this.SNACKBAR_DURATION,
      panelClass: `snackbar-${type}`,
    };
    this.snackBar.open(message, "Close", config);
  }

  private readonly SNACKBAR_DURATION = 2000;
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadRoles();
  }

  loadData(): void {
    const selectedUserId = this.selectedUser?.id;

    this.userService.getUsersCount().then((count) => {
      this.usersCount = count || 0;
    });

    this.userService
      .getUsers(
        this.currentPage,
        this.pageSize,
        this.statusFilter,
        this.searchText
      )
      .subscribe(
        (response) => {
          this.users = response.map((user) => ({
            ...user,
            status: user.deactivated
              ? UserStatus.Deactivated
              : UserStatus.Active,
          }));
          this.updateSelectedUser(selectedUserId);
          this.totalUsers = this.users.length;
        },
        (error) => {
          console.error("Error fetching users:", error);
        }
      );
  }

  updateSelectedUser(selectedUserId?: bigint) {
    if (selectedUserId !== undefined) {
      this.selectedUser =
        this.users.find((user) => {
          return selectedUserId === user.id;
        }) || null;
    } else if (this.users.length > 0) {
      this.selectedUser = this.users[0];
    } else {
      this.selectedUser = null;
    }

    this.updatedUser = this.selectedUser ? { ...this.selectedUser } : null;
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => {
        console.error("Error fetching roles:", error);
        this.snackBar.open("Error fetching roles", "Close", {
          duration: this.SNACKBAR_DURATION,
        });
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onUserClick(user: User) {
    this.selectedUser = user;
    this.updatedUser = { ...user };
  }

  getEmployeeButtons() {
    return [
      {
        label: "Save",
        onClick: () => this.confirmSaveEmployee(),
        shouldClose: false,
        class: "btn-save",
      },
      {
        label: this.selectedUser?.deactivated ? "Activate" : "Deactivate",
        onClick: () => this.confirmDeactivate(),
        shouldClose: false,
        class: "btn-deactivate",
      },
      {
        label: "Delete",
        onClick: () => this.confirmDeleteEmployee(),
        shouldClose: false,
        class: "btn-delete",
      },
      {
        label: "Save Role",
        onClick: () => this.confirmRoleUpdate(),
        shouldClose: false,
        class: "btn-save",
      },
    ];
  }

  updateRole() {
    if (this.selectedUser) {
      const userId = this.selectedUser.id.toString();
      const roleId = this.selectedUser.role_id.toString();
      this.userService.updateRole(userId, roleId).subscribe(
        (response) => {
          this.showSnackBar("Successfully updated role", "success");
          this.loadData();
          this.dialog.closeAll();
        },
        (error) => {
          console.error("Error updating role:", error);
          this.showSnackBar("Error updating role", "error");
        }
      );
    } else {
      this.snackBar.open("Selected user id or role id is undefined.", "Close", {
        duration: this.SNACKBAR_DURATION,
      });
    }
  }

  confirmRoleUpdate() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to update the role?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateRole();
      }
    });
  }

  saveEmployee() {
    if (this.selectedUser && this.updatedUser) {
      Object.assign(this.selectedUser, this.updatedUser);
      this.userService.updateUser(this.selectedUser).subscribe(
        (response) => {
          this.showSnackBar("Successfully updated employee", "success");
          this.loadData();
          this.dialog.closeAll();
        },
        (error) => {
          this.showSnackBar("Error updating the employee", "error");
          console.error("Error updating user:", error);
        }
      );
    }
  }

  confirmSaveEmployee() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to save the changes?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveEmployee();
      }
    });
  }

  deactivateEmployee() {
    if (this.selectedUser) {
      const isDeactivated = !this.selectedUser.deactivated;
      const snackBarMessage = isDeactivated
        ? "snackbar-error"
        : "snackbar-success";
      const message = isDeactivated
        ? "User deactivated successfully!"
        : "User activated successfully!";
      this.userService
        .deactivateUser(this.selectedUser.id, isDeactivated)
        .subscribe(
          (response) => {
            this.showSnackBar("Successfully deactivated employee", "success");
            this.loadData();
            this.dialog.closeAll();
          },
          (error) => {
            const errorMessage = isDeactivated
              ? "Error deactivating the user!"
              : "Error activating the user!";
            console.error(errorMessage, error);
            this.snackBar.open(errorMessage, "Close", {
              duration: this.SNACKBAR_DURATION,
            });
          }
        );
    }
  }

  confirmDeactivate() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to deactivate this user?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deactivateEmployee();
      }
    });
  }

  deleteEmployee() {
    if (this.selectedUser) {
      this.userService.deleteUser(this.selectedUser).subscribe(
        (response) => {
          this.showSnackBar("Successfully deleted employee", "success");
          this.loadData();
          this.dialog.closeAll();
          this.selectedUser = null;
        },
        (error) => {
          this.showSnackBar("Error deleting employee", "error");
          console.error("Error deleting user:", error);
        }
      );
    }
  }

  confirmDeleteEmployee() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to delete this user?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteEmployee();
        this.dialog.closeAll();
        this.selectedUser = null;
      }
    });
  }
}
