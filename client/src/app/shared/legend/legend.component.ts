import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgFor } from "@angular/common";
import LeaveSegmentType from "../../models/leaveSegmentType";

@Component({
  selector: "app-legend",
  standalone: true,
  templateUrl: "./legend.component.html",
  styleUrls: ["./legend.component.css"],
  imports: [NgFor],
})
export class LegendComponent implements OnInit {
  @Input() legends!: LeaveSegmentType[];
  @Output() legendClicked = new EventEmitter<bigint | null>();
  selectedLegendId: bigint | null = null;

  ngOnInit(): void {}

  onLegendClick(id: bigint): void {
    if (this.selectedLegendId === id) {
      this.selectedLegendId = null;
    } else {
      this.selectedLegendId = id;
    }
    this.legendClicked.emit(this.selectedLegendId);
  }

  isSelected(id: bigint): boolean {
    return this.selectedLegendId === id;
  }
}
