import WorkSegment from "../../entity/workSegment";
import db from "../../dbConfig";
import { CURRENT_UNIX, turnDateIntoUnix } from "../../utils/datesHelper";
import {
  addCalendarQueries,
  addPaginatorQueries,
} from "../../utils/repoQueryFunctions";
import WorkSegmentQueryParams from "../../ interfaces/workSegmentQueryParams";

async function createWorkSegment(
  workSegmentData: WorkSegment
): Promise<{ message: string }> {
  const query =
    "INSERT INTO work_segments (date, hours, notes, project_id, user_id, work_segment_type_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  await db.query(query, [
    turnDateIntoUnix(new Date(workSegmentData.date)),
    workSegmentData.hours,
    workSegmentData.notes,
    workSegmentData.project_id,
    workSegmentData.user_id,
    workSegmentData.work_segment_type_id,
    CURRENT_UNIX,
    CURRENT_UNIX,
  ]);
  return { message: "Successfully created work segment" };
}

async function fetchAllWorkSegments(
  params: WorkSegmentQueryParams
): Promise<WorkSegment[]> {
  let query = "SELECT * FROM work_segments";

  let whereClause: string[] = [];
  let queryParams: any[] = [];

  if (params.typeId) {
    whereClause.push("work_segment_type_id = ?");
    queryParams.push(params.typeId);
  }

  query = addCalendarQueries(
    params.startDate,
    params.endDate,
    whereClause,
    queryParams,
    query,
    "date"
  );

  query = addPaginatorQueries(params.page, params.pageSize, query, queryParams);

  const [workSegments]: any = await db.query(query, queryParams);
  return workSegments as WorkSegment[];
}

async function fetchWorkSegmentById(id: bigint): Promise<WorkSegment> {
  const query = "SELECT * FROM work_segments WHERE id = ?";
  const [workSegment]: any = await db.query(query, [id]);
  return workSegment[0] as WorkSegment;
}

async function fetchWorkSegmentsByUserId(
  userId: bigint,
  params: WorkSegmentQueryParams
): Promise<WorkSegment[]> {
  let query = "SELECT * FROM work_segments";

  let whereClause: string[] = [];
  let queryParams: any[] = [];

  whereClause.push("user_id = ?");
  queryParams.push(userId);

  if (params.typeId) {
    whereClause.push("work_segment_type_id = ?");
    queryParams.push(params.typeId);
  }

  query = addCalendarQueries(
    params.startDate,
    params.endDate,
    whereClause,
    queryParams,
    query,
    "date"
  );

  query = addPaginatorQueries(params.page, params.pageSize, query, queryParams);

  const [workSegment]: any = await db.query(query, queryParams);
  return workSegment as WorkSegment[];
}

async function fetchWorkSegmentsCount(
  params: WorkSegmentQueryParams,
  userId: bigint | undefined
): Promise<number> {
  let query = "SELECT COUNT(*) FROM work_segments";

  const queryParams: any[] = [];
  const whereClause: string[] = [];

  if (userId) {
    whereClause.push("user_id = ?");
    queryParams.push(userId);
  }

  if (params.typeId) {
    whereClause.push("work_segment_type_id = ?");
    queryParams.push(params.typeId);
  }

  query = addCalendarQueries(
    params.startDate,
    params.endDate,
    whereClause,
    queryParams,
    query,
    "date"
  );

  const [queryResponse]: any = await db.query(query, queryParams);
  return queryResponse[0]["COUNT(*)"];
}

async function updateWorkSegment(
  id: bigint,
  workSegmentData: WorkSegment
): Promise<{ message: string }> {
  let query = "UPDATE work_segments SET ";
  const values = [];

  if (workSegmentData.date) {
    query += "date = ?, ";
    values.push(turnDateIntoUnix(new Date(workSegmentData.date)));
  }
  if (workSegmentData.hours) {
    query += "hours = ?, ";
    values.push(workSegmentData.hours);
  }
  if (workSegmentData.notes) {
    query += "notes = ?, ";
    values.push(workSegmentData.notes);
  }
  if (workSegmentData.project_id) {
    query += "project_id = ?, ";
    values.push(workSegmentData.project_id);
  }
  if (workSegmentData.user_id) {
    query += "user_id = ?, ";
    values.push(workSegmentData.user_id);
  }
  if (workSegmentData.work_segment_type_id) {
    query += "work_segment_type_id = ?, ";
    values.push(workSegmentData.work_segment_type_id);
  }
  if (workSegmentData) {
    query += "updated_at = ?, ";
    values.push(CURRENT_UNIX);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  values.push(id);

  const result: any = await db.query(query, values);
  if (result[0].affectedRows === 0) {
    throw new Error(`Work Segment with ID ${id} does not exist`);
  }

  return { message: "Successfully updated work segment" };
}

async function deleteWorkSegment(id: bigint): Promise<{ message: string }> {
  const query = "DELETE FROM work_segments WHERE id = ?";
  const result: any = await db.query(query, [id]);

  if (result[0].affectedRows === 0) {
    throw new Error(`Work Segment with ID ${id} does not exist`);
  }

  return { message: "Successfully deleted work segment" };
}

export {
  createWorkSegment,
  updateWorkSegment,
  deleteWorkSegment,
  fetchAllWorkSegments,
  fetchWorkSegmentById,
  fetchWorkSegmentsByUserId,
  fetchWorkSegmentsCount,
};
