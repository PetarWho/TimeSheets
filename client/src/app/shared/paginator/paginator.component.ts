import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  ViewChild,
  SimpleChanges,
} from "@angular/core";
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from "@angular/material/paginator";

@Component({
  selector: "app-paginator",
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: "./paginator.component.html",
  styleUrls: ["./paginator.component.css"],
})
export class PaginatorComponent implements OnChanges {
  @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() itemsCount!: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageEvent(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["itemsCount"] && !changes["itemsCount"].isFirstChange()) {
      this.resetPaginator();
    }
  }

  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}
