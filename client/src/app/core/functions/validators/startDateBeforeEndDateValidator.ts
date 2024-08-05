import { AbstractControl, ValidatorFn } from "@angular/forms";

export function startDateBeforeEndDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const startDate = control.get("start_date")?.value;
    const endDate = control.get("end_date")?.value;

    if (startDate && endDate && startDate > endDate) {
      return { startDateAfterEndDate: true };
    }
    return null;
  };
}
