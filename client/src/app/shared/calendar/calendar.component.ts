import { Component, EventEmitter, Output } from "@angular/core";
import { IgxCalendarModule } from "igniteui-angular";
import { CommonModule } from "@angular/common";
import { convertToUTC } from "../../core/functions/dateFunctions";

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [CommonModule, IgxCalendarModule],
  styleUrls: ["./calendar.component.css"],
  templateUrl: "./calendar.component.html",
})
export class CalendarComponent {
  @Output() dateRangeSelected = new EventEmitter<{
    startDate: Date;
    endDate: Date;
  }>();
  selectedDates: any = null;

  handleSelectionChange(event: any) {
    if (event && event.length > 0) {
      this.selectedDates = {
        startDate: convertToUTC(event[0]),
        endDate: convertToUTC(event[event.length - 1]),
      };
      this.dateRangeSelected.emit(this.selectedDates);
    } else {
      this.selectedDates = null;
      this.dateRangeSelected.emit(this.selectedDates);
    }
  }
}
