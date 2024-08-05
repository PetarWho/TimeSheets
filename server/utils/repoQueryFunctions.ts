import { convertStringToDate, turnDateIntoUnix } from "./datesHelper";

/**
 *
 * @param {string|undefined} startDateParams - Calendar start date
 * @param {string|undefined} endDateParams - Calendar end date
 * @param {string[]} whereClause - List of where clausesm to which will be added the date range
 * @param {any[]} queryParams - List of query params
 * @param {string} query - String query that will be modified with all where clauses and returned
 * @param {string} columnNameToCompare - Name of the column that will be queried by the function
 * @returns {string} query - The modified query
 */
export function addCalendarQueries(
  startDateParams: string | undefined,
  endDateParams: string | undefined,
  whereClause: string[],
  queryParams: any[],
  query: string,
  columnNameToCompare: string
): string {
  let startDateRequest: Date | undefined = convertStringToDate(startDateParams);
  let endDateRequest: Date | undefined = convertStringToDate(endDateParams);

  if (startDateRequest) {
    let startDate = turnDateIntoUnix(startDateRequest);
    let endDate = startDate;

    if (endDateRequest) {
      endDate = turnDateIntoUnix(endDateRequest);
    }

    whereClause.push(`(${columnNameToCompare} BETWEEN ? AND ?)`);
    queryParams.push(startDate, endDate);
  }
  if (whereClause.length > 0) {
    query += " WHERE " + whereClause.join(" AND ");
  }

  return query;
}

/**
 * Adds paginator query to the current query and returns it. Call this function last, after you are done with the query, since pagination is last.
 * @param {number|undefined} pageParams - Page params of the request
 * @param {number|undefined} pageSizeParams - Page size params of the request
 * @param {string} query - Current query to which will be added pagination.
 * @param {any[]} queryParams - List of query params
 * @returns {string} query - The modified query
 */
export function addPaginatorQueries(
  pageParams: number | undefined,
  pageSizeParams: number | undefined,
  query: string,
  queryParams: any[]
): string {
  if (pageParams !== undefined && pageSizeParams !== undefined) {
    const offset = pageParams * pageSizeParams;
    query += " LIMIT ? OFFSET ?";
    queryParams.push(pageSizeParams, offset);
  }

  return query;
}
