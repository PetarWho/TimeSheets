import {
  AfterViewInit,
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from "@angular/core";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-table",
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule],
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
  providers: [DatePipe],
})
export class TableComponent<D> implements AfterViewInit, OnChanges, OnInit {
  @Input() columns: {
    key: string;
    header: string;
    sortDescription?: string;
    type?: string;
  }[] = [];
  @Input() selectedRow: D | null = null;
  @Input() data: D[] = [];
  @Output() rowClick: EventEmitter<D> = new EventEmitter<D>();
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<D> = new MatTableDataSource<D>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.displayedColumns = this.columns.map((column) => column.key);
    this.dataSource.data = this.data;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"]) {
      this.dataSource.data = this.data;
      this.changeDetectorRef.detectChanges();
    }
  }

  onRowClick(row: D) {
    this.selectedRow = row;
    this.rowClick.emit(row);
  }

  formatValue(column: any, value: any) {
    if (column.type === "date") {
      return this.datePipe.transform(value, "mediumDate");
    }
    return value;
  }
  isRowSelected(row: D): boolean {
    return this.selectedRow === row;
  }
}
