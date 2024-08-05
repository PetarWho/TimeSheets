import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-input-field",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./input-field.component.html",
  styleUrls: ["./input-field.component.css"],
})
export class InputFieldComponent {
  @Input() type: string = "";
  @Input() name: string = "";
  @Input() placeholder: string = "";
  @Input() label: string = "";
  @Input() model: any;
  @Input() required: boolean = false;
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  onModelChange(value: any) {
    this.modelChange.emit(value);
  }
}
