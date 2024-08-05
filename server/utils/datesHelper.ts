import moment from "moment";

export const CURRENT_UNIX = moment(new Date()).valueOf();

export function formatDateToYMD(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function convertStringToDate(
  dateString: string | undefined
): Date | undefined {
  if (dateString) {
    return new Date(dateString);
  }
}

export function turnDateIntoUnix(date: Date): number {
  return moment(date).valueOf();
}
