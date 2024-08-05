import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { AutocompleteFilterComponent } from "../../shared/autocomplete-filter/autocomplete-filter.component";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import { TableComponent } from "../../shared/table/table.component";
import { Team } from "../../models/team";
import { ProjectService } from "../../core/services/project.service";
import { TeamService } from "../../core/services/team.service";
import { TeamMembershipService } from "../../core/services/team-membership.service";
import { PageEvent } from "@angular/material/paginator";
import { CommonModule } from "@angular/common";
import { SearchbarComponent } from "../../shared/searchbar/searchbar.component";
import { DialogComponent } from "../../shared/dialog/dialog.component";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import User from "../../models/user";
import { UserService } from "../../core/services/user.service";
import { forkJoin, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { TeamMembership } from "../../models/teamMembership";
import { UserStatus } from "../../models/enums/user-status.enum";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { RoleEnum } from "../../models/enums/roles.enum";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-teams",
  standalone: true,
  imports: [
    NavbarComponent,
    AutocompleteFilterComponent,
    PaginatorComponent,
    TableComponent,
    FormsModule,
    DialogComponent,
    CommonModule,
    SearchbarComponent,
  ],
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.css"],
  animations: [
    trigger("slideInFromBottom", [
      state("void", style({ transform: "translateY(100%)", opacity: 0 })),
      state("*", style({ transform: "translateY(0)", opacity: 1 })),
      transition(":enter", [animate("0.7s ease-in")]),
    ]),
  ],
})
export class TeamsComponent implements OnInit {
  @ViewChild(DialogComponent) private dialogComponent!: DialogComponent;
  data: Team[] = [];
  currentPage = 0;
  pageSize = 10;
  searchText = "";
  teamsCount!: number;
  selectedTeam: Team | null = null;
  updatedTeam: Team | null = null;
  members: { user: User; membershipId: bigint }[] = [];
  removedMembers: { user: User; membershipId: bigint }[] = [];
  addedMembers: { user: User; membershipId: bigint }[] = [];
  usersAutocompleteNames: { name: string; id: bigint }[] = [];
  isAdminOrManager!: boolean;

  columns = [
    { key: "name", header: "Teams Name", sortDescription: "Sort by team name" },
    { key: "project", header: "Project", sortDescription: "Sort by project" },
    {
      key: "created_at",
      header: "Created at",
      sortDescription: "Sort by date created",
      type: "date",
    },
    {
      key: "updated_at",
      header: "Updated at",
      sortDescription: "Sort by date updated",
      type: "date",
    },
    {
      key: "members",
      header: "Members",
      sortDescription: "Sort by number of members",
    },
  ];
  showSnackBar(message: string, type: "success" | "error"): void {
    const config: MatSnackBarConfig = {
      duration: this.SNACKBAR_DURATION,
      panelClass: `snackbar-${type}`,
    };
    this.snackBar.open(message, "Close", config);
  }

  private readonly SNACKBAR_DURATION = 2000;

  constructor(
    private projectService: ProjectService,
    private teamService: TeamService,
    private teamMembershipService: TeamMembershipService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.checkRole();
  }

  loadData(): void {
    this.teamService.getTeamsCount(null).then((count) => {
      this.teamsCount = count || 0;
    });
    forkJoin({
      projects: this.projectService.getAllProjects(),
      teamMemberships: this.teamMembershipService.getAllTeamMemberships(),
      teams: this.teamService.getAllTeams(
        this.currentPage,
        this.pageSize,
        this.searchText
      ),
    }).subscribe(
      ({ teams, projects, teamMemberships }) => {
        this.data = teams.map((team) => {
          const teamProject =
            projects.find((project) => project.id === team.project_id)?.name ||
            "Not assigned";
          const teamMembership =
            teamMemberships.find((membership) => membership.team_id === team.id)
              ?.user_id || "Not assigned";
          const membersCount =
            teamMemberships.filter(
              (membership) => membership.team_id === team.id
            ).length || 0;

          return {
            ...team,
            project: teamProject,
            teamMembership: teamMembership,
            members: membersCount,
          };
        });
      },
      () => {
        this.showSnackBar("Error fetching data", "error");
      }
    );
  }

  loadUserData(filter: string): void {
    this.userService.getUsers(0, 10, UserStatus.Active, filter).subscribe(
      (usersAutocomplete) => {
        const memberIds = new Set(this.members.map((member) => member.user.id));
        this.usersAutocompleteNames = usersAutocomplete
          .filter((user: User) => !memberIds.has(user.id))
          .map((user: User) => ({
            name: user.name,
            id: user.id,
          }));

        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching user data", error);
        this.showSnackBar("Error fetching user data", "error");
      }
    );
  }

  onUserInputChanged(filter: string) {
    this.loadUserData(filter);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onTeamClick(team: Team) {
    if (this.isAdminOrManager) {
      this.selectedTeam = team;
      this.updatedTeam = { ...team };
      if (team.members != 0) {
        this.teamMembershipService
          .getTeamMembershipsByTeamId(team.id)
          .subscribe(
            (teamMemberships) => {
              const userRequests = teamMemberships.map((membership) =>
                this.userService
                  .getUserById(membership.user_id)
                  .pipe(map((user) => ({ user, membershipId: membership.id })))
              );

              forkJoin(userRequests).subscribe(
                (members) => {
                  this.members = members;
                  this.dialogComponent.openDialog();
                },
                () => {
                  this.showSnackBar("Error fetching team members", "error");
                }
              );
            },
            (error) => {
              console.error("Error fetching team members:", error);
              this.showSnackBar("Error fetching team members", "error");
            }
          );
      } else {
        this.members = [];
        this.dialogComponent.openDialog();
      }
    }
  }

  displayOption(option: { name: string; id: bigint }): string {
    return option ? option.name : "";
  }

  onUserSelected(option: { name: string; id: bigint }): void {
    if (!this.selectedTeam) {
      this.showSnackBar("Error saving new member: No team selected", "error");
      return;
    }
    this.userService.getUserById(option.id).subscribe(
      (user) => {
        const removedIndex = this.removedMembers.findIndex(
          (member) => member.user.id === user.id
        );
        if (removedIndex !== -1) {
          this.removedMembers.splice(removedIndex, 1);
        } else {
          const addedIndex = this.addedMembers.findIndex(
            (member) => member.user.id === user.id
          );
          if (addedIndex === -1) {
            this.addedMembers.push({ user, membershipId: BigInt(0) });
          }
        }
        this.members.push({ user, membershipId: BigInt(0) });
      },
      (error) => {
        console.error("Error fetching user data", error);
        this.showSnackBar("Error fetching user data", "error");
      }
    );
  }

  onSearchTextChange(searchText: string): void {
    this.searchText = searchText;
    this.currentPage = 0;
    this.loadData();
  }

  getTeamButtons() {
    return [
      {
        label: "Save",
        onClick: () => this.confirmSaveTeam(),
        class: "btn-save",
        shouldClose: false,
      },
      {
        label: "Delete",
        onClick: () => this.confirmDeleteTeam(),
        class: "btn-delete",
        shouldClose: false,
      },
    ];
  }

  saveTeam() {
    if (this.selectedTeam && this.updatedTeam) {
      Object.assign(this.selectedTeam, this.updatedTeam);

      this.teamService.updateTeam(this.selectedTeam).subscribe(
        (response) => {
          this.showSnackBar("Successfully updated team", "success");
          this.dialogComponent.closeDialog();
          const deleteRequests = this.removedMembers.map((member) =>
            this.teamMembershipService
              .deleteTeamMembership(member.membershipId)
              .pipe(
                catchError((error) => {
                  this.showSnackBar("Error removing member", "error");
                  return of(null);
                })
              )
          );

          const addRequests = this.addedMembers.map((member) => {
            const newTeamMembership: TeamMembership = {
              id: BigInt(0),
              user_id: member.user.id,
              team_id: this.selectedTeam!.id!,
            };
            return this.teamMembershipService
              .createTeamMembership(newTeamMembership)
              .pipe(
                catchError((error) => {
                  this.showSnackBar("Error adding member", "error");
                  return of(null);
                })
              );
          });

          forkJoin([...deleteRequests, ...addRequests]).subscribe(() => {
            this.loadData();
            this.removedMembers = [];
            this.addedMembers = [];
          });
        },
        (error) => {
          this.showSnackBar("Error updating team", "error");
        }
      );
    }
  }

  removeMember(membershipId: bigint) {
    const memberToRemove = this.members.find(
      (member) => member.membershipId === membershipId
    );

    if (!memberToRemove) {
      return;
    }

    const isAddedMember = this.addedMembers.some(
      (added) => added.user.id === memberToRemove.user.id
    );

    if (isAddedMember) {
      const addedIndex = this.addedMembers.findIndex(
        (added) => added.user.id === memberToRemove.user.id
      );
      if (addedIndex !== -1) {
        this.addedMembers.splice(addedIndex, 1);
      }
    } else {
      this.removedMembers.push(memberToRemove);
    }

    this.members = this.members.filter(
      (member) => member.membershipId !== membershipId
    );
  }

  confirmSaveTeam() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to save the changes?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveTeam();
      }
    });
  }

  deleteTeam() {
    if (!this.selectedTeam) {
      this.showSnackBar("No team selected to delete", "error");
      return;
    }

    this.teamService.deleteTeam(this.selectedTeam).subscribe(
      () => {
        this.showSnackBar("Team deleted successfully", "success");
        this.loadData();
        this.dialogComponent.closeDialog();
      },
      () => {
        this.showSnackBar("Error deleting team", "error");
      }
    );
  }
  confirmDeleteTeam() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to delete this team?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTeam();
        this.dialog.closeAll();
      }
    });
  }

  checkRole(): void {
    this.authService.getUserRole().subscribe((role) => {
      this.isAdminOrManager =
        role.name == RoleEnum.Admin || role.name == RoleEnum.Manager;
    });
  }
}
