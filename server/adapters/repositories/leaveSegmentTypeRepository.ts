import BaseQueryParams from "../../ interfaces/baseQueryParams";
import db from "../../dbConfig";
import LeaveSegmentType from "../../entity/leaveSegmentType";
import { CURRENT_UNIX } from "../../utils/datesHelper";
import { addPaginatorQueries } from "../../utils/repoQueryFunctions";

async function createLeaveSegmentType(
  leaveSegmentTypeData: LeaveSegmentType
): Promise<{ message: string }> {
  const query =
    "INSERT INTO leave_segment_types (name, color, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
  await db.query(query, [
    leaveSegmentTypeData.name,
    leaveSegmentTypeData.color,
    leaveSegmentTypeData.description,
    CURRENT_UNIX,
    CURRENT_UNIX,
  ]);
  return { message: "Successfully created leave segment type" };
}
async function fetchAllLeaveSegmentTypes(
  params: BaseQueryParams
): Promise<LeaveSegmentType[]> {
  let query = "SELECT * FROM leave_segment_types";
  const queryParams: (string | number)[] = [];
  const whereClause: string[] = [];

  if (params.search) {
    whereClause.push("(name LIKE ?)");
    const searchPattern = `%${params.search}%`;
    queryParams.push(searchPattern);
  }
  if (whereClause.length > 0) {
    query += " WHERE " + whereClause.join(" AND ");
  }

  if (params.page !== undefined && params.pageSize !== undefined) {
    const offset = params.page * params.pageSize;
    query += " LIMIT ? OFFSET ?";
    queryParams.push(params.pageSize, offset);
  }

  const [leaveSegmentTypes]: any = await db.query(query, queryParams);
  return leaveSegmentTypes;
}

async function fetchLeaveSegmentTypeById(
  id: bigint
): Promise<LeaveSegmentType> {
  const query = "SELECT * FROM leave_segment_types WHERE id = ?";
  const [leaveSegmentTypes]: any = await db.query(query, [id]);
  return leaveSegmentTypes[0];
}

async function updateLeaveSegmentType(
  id: bigint,
  leaveSegmentTypeData: LeaveSegmentType
): Promise<{ message: string }> {
  let query = "UPDATE leave_segment_types SET ";
  const values = [];

  if (leaveSegmentTypeData.name !== undefined) {
    query += "name = ?, ";
    values.push(leaveSegmentTypeData.name);
  }
  if (leaveSegmentTypeData.color !== undefined) {
    query += "color = ?, ";
    values.push(leaveSegmentTypeData.color);
  }
  if (leaveSegmentTypeData.description !== undefined) {
    query += "description = ?, ";
    values.push(leaveSegmentTypeData.description);
  }
  if (leaveSegmentTypeData) {
    query += "updated_at = ?, ";
    values.push(CURRENT_UNIX);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  values.push(id);

  const result: any = await db.query(query, values);
  if (result[0].affectedRows === 0) {
    throw new Error(`Leave Segment Type with ID ${id} does not exist`);
  }

  return { message: "Successfully updated leave segment type" };
}

async function deleteLeaveSegmentType(
  id: bigint
): Promise<{ message: string }> {
  const query = "DELETE FROM leave_segment_types WHERE id = ?";
  const result: any = await db.query(query, [id]);
  if (result[0].affectedRows === 0) {
    throw new Error(`Leave Segment Type with ID ${id} does not exist`);
  }
  return { message: "Successfully deleted leave segment type" };
}

export {
  createLeaveSegmentType,
  fetchAllLeaveSegmentTypes,
  fetchLeaveSegmentTypeById,
  updateLeaveSegmentType,
  deleteLeaveSegmentType,
};
