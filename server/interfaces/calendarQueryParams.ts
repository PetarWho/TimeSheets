import BaseQueryParams from "./baseQueryParams";

export default interface CalendarQueryParams extends BaseQueryParams {
  startDate?: string;
  endDate?: string;
}
