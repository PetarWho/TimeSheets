import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./buttons.component.html",
  styleUrls: ["./buttons.component.css"],
})
export class ButtonComponent {
  @Input() btnName: string | undefined;
  @Input() btnClass: string | undefined;
  @Output() buttonClick = new EventEmitter<void>();

  handleClick() {
    this.buttonClick.emit();
  }
}
