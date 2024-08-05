import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Observable, of } from "rxjs";
import { CommonModule } from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: "app-autocomplete-filter",
  templateUrl: "./autocomplete-filter.component.html",
  styleUrls: ["./autocomplete-filter.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
})
export class AutocompleteFilterComponent<T> implements OnInit, OnChanges {
  @Input() label: string = "Label";
  @Input() options: T[] = [];
  @Input() displayFn: (option: T) => string = () => "";
  @Input() set selectedOption(option: T | null) {
    if (option) {
      this.formControl.setValue(option);
    }
  }
  @Output() optionSelected = new EventEmitter<T>();
  @Output() inputChanged = new EventEmitter<string>();

  formControl = new FormControl();
  filteredOptions: Observable<T[]> = of([]);

  ngOnInit() {
    this.formControl.valueChanges.subscribe((value) => {
      this.inputChanged.emit(value);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["options"]) {
      this.filteredOptions = of(this.options);
    }
  }

  onOptionSelected(event: any): void {
    const selectedOption = event.option.value;
    this.optionSelected.emit(selectedOption);
  }
}
