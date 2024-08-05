import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: "app-searchbar",
  templateUrl: "./searchbar.component.html",
  styleUrls: ["./searchbar.component.css"],
})
export class SearchbarComponent {
  @Input() placeholder: string = "Search employees...";
  @Output() searchTextChange: EventEmitter<string> = new EventEmitter<string>();

  searchText = "";

  onInputChange(): void {
    this.searchTextChange.emit(this.searchText);
  }
}
