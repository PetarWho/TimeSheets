import LeaveSegmentQueryParams from "../../ interfaces/leaveSegmentQueryParams";
import db from "../../dbConfig";
import LeaveSegment from "../../entity/leaveSegment";
import { LeaveSegmentStatus } from "../../enums/leaveSegmentTypeStatus.enum";
import { CURRENT_UNIX, turnDateIntoUnix } from "../../utils/datesHelper";
import {
  addCalendarQueries,
  addPaginatorQueries,
} from "../../utils/repoQueryFunctions";

async function createLeaveSegment(
  leaveSegmentData: LeaveSegment
): Promise<{ message: string }> {
  const query =
    "INSERT INTO leave_segments (start_date, end_date, notes, user_id, leave_segment_type_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";

  await db.query(query, [
    turnDateIntoUnix(new Date(leaveSegmentData.start_date)),
    turnDateIntoUnix(new Date(leaveSegmentData.end_date)),
    leaveSegmentData.notes,
    leaveSegmentData.user_id,
    leaveSegmentData.leave_segment_type_id,
    CURRENT_UNIX,
    CURRENT_UNIX,
  ]);
  return { message: "Successfully created leave segment" };
}

async function fetchAllLeaveSegments(
  params: LeaveSegmentQueryParams
): Promise<LeaveSegment[]> {
  let query = "SELECT * FROM leave_segments";

  const queryParams: (LeaveSegmentStatus | string | number | bigint)[] = [];
  const whereClause: string[] = [];

  if (params.status) {
    switch (params.status.toLowerCase()) {
      case LeaveSegmentStatus.Approved:
      case LeaveSegmentStatus.Awaiting:
      case LeaveSegmentStatus.Denied:
        whereClause.push("status = ?");
        queryParams.push(params.status);
    }
  }

  if (params.typeId) {
    whereClause.push("leave_segment_type_id = ?");
    queryParams.push(params.typeId);
  }

  query = addCalendarQueries(
    params.startDate,
    params.endDate,
    whereClause,
    queryParams,
    query,
    "start_date"
  );

  query = addPaginatorQueries(params.page, params.pageSize, query, queryParams);

  const [leaveSegments]: any = await db.query(query, queryParams);
  return leaveSegments as LeaveSegment[];
}

async function fetchLeaveSegmentById(id: bigint): Promise<LeaveSegment> {
  const query = "SELECT * FROM leave_segments WHERE id = ?";
  const [leaveSegments]: any = await db.query(query, [id]);
  return leaveSegments[0];
}

async function fetchLeaveSegmentsByUserId(
  userId: bigint,
  params: LeaveSegmentQueryParams
): Promise<LeaveSegment[]> {
  let query = "SELECT * FROM leave_segments";

  const queryParams: (LeaveSegmentStatus | string | number | bigint)[] = [];
  const whereClause: string[] = [];

  whereClause.push("user_id = ?");
  queryParams.push(userId);

  if (params.status) {
    switch (params.status.toLowerCase()) {
      case LeaveSegmentStatus.Approved:
      case LeaveSegmentStatus.Awaiting:
      case LeaveSegmentStatus.Denied:
        whereClause.push("status = ?");
        queryParams.push(params.status);
    }
  }

  if (params.typeId) {
    whereClause.push("leave_segment_type_id = ?");
    queryParams.push(params.typeId);
  }

  query = addCalendarQueries(
    params.startDate,
    params.endDate,
    whereClause,
    queryParams,
    query,
    "start_date"
  );

  query = addPaginatorQueries(params.page, params.pageSize, query, queryParams);
  const [leaveSegments]: any = await db.query(query, queryParams);
  return leaveSegments;
}

async function fetchLeaveSegmentsCount(
  params: LeaveSegmentQueryParams,
  userId: bigint | undefined
): Promise<number> {
  let query = "SELECT COUNT(*) FROM leave_segments";

  const queryParams: (LeaveSegmentStatus | string | number | bigint)[] = [];
  const whereClause: string[] = [];

  if (userId) {
    whereClause.push("user_id = ?");
    queryParams.push(userId);
  }

  if (params.typeId) {
    whereClause.push("leave_segment_type_id = ?");
    queryParams.push(params.typeId);
  }

  if (params.status) {
    switch (params.status.toLowerCase()) {
      case LeaveSegmentStatus.Approved:
      case LeaveSegmentStatus.Awaiting:
      case LeaveSegmentStatus.Denied:
        whereClause.push("status = ?");
        queryParams.push(params.status);
    }
  }

  query = addCalendarQueries(
    params.startDate,
    params.endDate,
    whereClause,
    queryParams,
    query,
    "start_date"
  );

  const [queryResponse]: any = await db.query(query, queryParams);
  return queryResponse[0]["COUNT(*)"];
}

async function updateLeaveSegment(
  id: bigint,
  leaveSegmentData: LeaveSegment
): Promise<{ message: string }> {
  let query = "UPDATE leave_segments SET ";
  const values = [];

  if (leaveSegmentData.start_date) {
    query += "start_date = ?, ";
    values.push(turnDateIntoUnix(new Date(leaveSegmentData.start_date)));
  }
  if (leaveSegmentData.end_date) {
    query += "end_date = ?, ";
    values.push(turnDateIntoUnix(new Date(leaveSegmentData.end_date)));
  }
  if (leaveSegmentData.notes) {
    query += "notes = ?, ";
    values.push(leaveSegmentData.notes);
  }
  if (leaveSegmentData.user_id) {
    query += "user_id = ?, ";
    values.push(leaveSegmentData.user_id);
  }
  if (leaveSegmentData.leave_segment_type_id) {
    query += "leave_segment_type_id = ?, ";
    values.push(leaveSegmentData.leave_segment_type_id);
  }
  if (leaveSegmentData) {
    query += "updated_at = ?, ";
    values.push(CURRENT_UNIX);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  values.push(id);

  const result: any = await db.query(query, values);
  if (result[0].affectedRows === 0) {
    throw new Error(`Leave Segment with ID ${id} does not exist`);
  }

  return { message: "Successfully updated leave segment" };
}

async function deleteLeaveSegment(id: bigint): Promise<{ message: string }> {
  const query = "DELETE FROM leave_segments WHERE id = ?";
  const result: any = await db.query(query, [id]);
  if (result[0].affectedRows === 0) {
    throw new Error(`Leave segment with ID ${id} does not exist`);
  }
  return { message: "Successfully deleted leave segment" };
}
export {
  createLeaveSegment,
  updateLeaveSegment,
  fetchAllLeaveSegments,
  fetchLeaveSegmentsByUserId,
  fetchLeaveSegmentById,
  deleteLeaveSegment,
  fetchLeaveSegmentsCount,
};
