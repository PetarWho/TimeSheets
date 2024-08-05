import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { AutocompleteFilterComponent } from "../../shared/autocomplete-filter/autocomplete-filter.component";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import { TableComponent } from "../../shared/table/table.component";
import { Project } from "../../models/project";
import { ProjectService } from "../../core/services/project.service";
import { TeamService } from "../../core/services/team.service";
import { ClientService } from "../../core/services/client.service";
import { CommonModule } from "@angular/common";
import { PageEvent } from "@angular/material/paginator";
import { FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { SearchbarComponent } from "../../shared/searchbar/searchbar.component";
import { DialogComponent } from "../../shared/dialog/dialog.component";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { Client } from "../../models/client";
import { AuthService } from "../../core/services/auth.service";
import { RoleEnum } from "../../models/enums/roles.enum";
import DialogButton from "../../models/data_transfer_objects/dialogButton";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  forkJoin,
  map,
  Observable,
} from "rxjs";

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
@Component({
  selector: "app-projects",
  standalone: true,
  imports: [
    NavbarComponent,
    AutocompleteFilterComponent,
    PaginatorComponent,
    TableComponent,
    CommonModule,
    FormsModule,
    DialogComponent,
    SearchbarComponent,
  ],
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.css"],
  animations: [
    trigger("slideInFromBottom", [
      state("void", style({ transform: "translateY(100%)", opacity: 0 })),
      state("*", style({ transform: "translateY(0)", opacity: 1 })),
      transition(":enter", [animate("0.7s ease-in")]),
    ]),
  ],
})
export class ProjectsComponent implements OnInit {
  @ViewChild("projectTemplate", { static: true })
  projectTemplate!: TemplateRef<any>;

  @ViewChild(DialogComponent) private dialogComponent!: DialogComponent;
  searchText$ = new Subject<string>();
  data: Project[] = [];
  currentPage = 0;
  pageSize = 10;
  searchText = "";
  projectsCount!: number;
  selectedProject: Project | null = null;
  clients: Client[] = [];
  selectedClientId: bigint | null = null;
  clientNames: { name: string; id: bigint }[] = [];
  selectedClientOption: { name: string; id: bigint } | null = null;
  isAdminOrManager!: boolean;

  columns = [
    {
      key: "name",
      header: "Project Name",
      sortDescription: "Sort by project name",
    },
    { key: "team", header: "Team", sortDescription: "Sort by team" },
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
      key: "client",
      header: "Client",
      sortDescription: "Sort by client",
    },
  ];
  private readonly SNACKBAR_DURATION = 2000;
  showSnackBar(message: string, type: "success" | "error"): void {
    const config: MatSnackBarConfig = {
      duration: this.SNACKBAR_DURATION,
      panelClass: `snackbar-${type}`,
    };
    this.snackBar.open(message, "Close", config);
  }

  constructor(
    private projectService: ProjectService,
    private teamService: TeamService,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkRole();
    this.loadData();
    this.setupProjectSearch();
  }

  loadData(): void {
    this.projectService.getProjectsCount(null).then((count) => {
      this.projectsCount = count || 0;
    });

    forkJoin({
      projects: this.projectService.getAllProjects(
        this.currentPage,
        this.pageSize,
        this.searchText
      ),
      teams: this.teamService.getAllTeams(),
    })
      .pipe(
        switchMap(({ projects, teams }) => {
          const clientRequests: Observable<Client>[] = projects.map((project) =>
            this.clientService.getClientById(project.client_id)
          );

          return forkJoin(clientRequests).pipe(
            map((clients) => ({ projects, teams, clients }))
          );
        })
      )
      .subscribe(
        ({ projects, teams, clients }) => {
          this.data = projects.map((project) => {
            const team = teams.find((team) => team.project_id === project.id);
            const client = clients.find(
              (client) => client.id === project.client_id
            );
            this.cdr.detectChanges();
            return {
              ...project,
              team: team ? team.name : "Not assigned",
              client: client ? client.name : "Unknown",
            };
          });
        },
        (error) => {
          this.showSnackBar("Error fetching data", "error");
          console.error("Error fetching data", error);
        }
      );
  }

  loadClientData(filter: string): void {
    this.clientService.getAllClients(0, 10, filter).subscribe(
      (clientsAutocomplete) => {
        this.clientNames = clientsAutocomplete.map((client: Client) => ({
          name: client.name,
          id: client.id,
        }));
        this.cdr.detectChanges();
      },
      (error) => {
        this.showSnackBar("Error fetching data", "error");
        console.error("Error fetching data", error);
      }
    );
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
  onInputChanged(filter: string) {
    this.loadClientData(filter);
  }

  onProjectClick(project: Project): void {
    this.selectedProject = { ...project };
    this.selectedClientId = project.client_id;
    if (this.isAdminOrManager) {
      this.clientService
        .getClientById(project.client_id)
        .subscribe((client) => {
          this.selectedClientId = client.id;
          this.selectedClientOption = {
            name: client.name,
            id: client.id,
          };
          this.dialogComponent.openDialog();
        });
    }
  }

  setupProjectSearch(): void {
    this.searchText$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchText) =>
          forkJoin({
            projects: this.projectService.getAllProjects(
              this.currentPage,
              this.pageSize,
              searchText
            ),
            teams: this.teamService.getAllTeams(),
            clients: this.clientService.getAllClients(0, 1000, ""),
          })
        )
      )
      .subscribe(
        ({ projects, teams, clients }) => {
          this.data = projects.map((project) => {
            const team = teams.find((team) => team.project_id === project.id);
            const client = clients.find(
              (client) => client.id === project.client_id
            );
            return {
              ...project,
              team: team ? team.name : "Not assigned",
              client: client ? client.name : "Unknown",
            };
          });
        },
        (error) => {
          this.showSnackBar("Error fetching data", "error");
          console.error("Error fetching data", error);
        }
      );
  }

  onSearchTextChange(searchText: string): void {
    this.searchText = searchText;
    this.searchText$.next(searchText);
  }

  onClientSelected(option: { name: string; id: bigint }): void {
    this.selectedClientId = option.id;
  }

  displayClient(option: { name: string; id: bigint }): string {
    return option ? option.name : "";
  }

  getProjectButtons() {
    return [
      {
        label: "Save",
        onClick: () => this.confirmSaveProject(),
        class: "btn-save",
        shouldClose: false,
      },
      {
        label: "Delete",
        onClick: () => this.confirmDeleteProject(),
        class: "btn-delete",
        shouldClose: false,
      },
    ];
  }

  saveProject() {
    if (this.selectedProject) {
      this.selectedProject.client_id = this.selectedClientId!;
      this.projectService.updateProject(this.selectedProject).subscribe(
        () => {
          this.showSnackBar("Successfully updated project", "success");
          this.loadData();
        },
        (error) => {
          this.showSnackBar("Error updating project", "error");
          console.error("Error updating project", error);
        }
      );
    }
  }
  confirmSaveProject() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to save the changes?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveProject();
        this.dialog.closeAll();
      }
    });
  }

  deleteProject(): void {
    if (this.selectedProject) {
      this.projectService.deleteProject(this.selectedProject).subscribe(
        () => {
          this.showSnackBar("Successfully deleted project", "success");
          this.loadData();
          this.selectedProject = null;
        },
        (error) => {
          this.showSnackBar("Error deleting project", "error");
          console.error("Error deleting project", error);
        }
      );
    }
  }
  confirmDeleteProject() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Are you sure you want to delete this team?" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProject();
        this.dialog.closeAll();
        this.selectedProject = null;
      }
    });
  }
}
