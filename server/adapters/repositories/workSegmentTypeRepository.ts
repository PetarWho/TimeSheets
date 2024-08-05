import WorkSegmentType from "../../entity/workSegmentType";
import db from "../../dbConfig";
import { CURRENT_UNIX } from "../../utils/datesHelper";
import BaseQueryParams from "../../ interfaces/baseQueryParams";

async function createWorkSegmentType(
  workSegmentTypeData: WorkSegmentType
): Promise<{ message: string }> {
  const query =
    "INSERT INTO work_segment_types (name, color, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
  await db.query(query, [
    workSegmentTypeData.name,
    workSegmentTypeData.color,
    workSegmentTypeData.description,
    CURRENT_UNIX,
    CURRENT_UNIX,
  ]);
  return { message: "Successfully created work segment type" };
}

async function fetchAllWorkSegmentTypes(
  params: BaseQueryParams
): Promise<WorkSegmentType[]> {
  let query = "SELECT * FROM work_segment_types";
  const queryParams: (string | number | bigint)[] = [];
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
  const [workSegmentTypes] = await db.query(query, queryParams);
  return workSegmentTypes as WorkSegmentType[];
}

async function fetchWorkSegmentTypeById(id: bigint): Promise<WorkSegmentType> {
  const query = "SELECT * FROM work_segment_types WHERE id = ?";
  const [workSegmentType]: any = await db.query(query, [id]);
  return workSegmentType[0] as WorkSegmentType;
}

async function updateWorkSegmentType(
  id: bigint,
  workSegmentTypeData: WorkSegmentType
): Promise<{ message: string }> {
  let query = "UPDATE work_segment_types SET ";
  const values = [];

  if (workSegmentTypeData.name) {
    query += "name = ?, ";
    values.push(workSegmentTypeData.name);
  }
  if (workSegmentTypeData.color) {
    query += "color = ?, ";
    values.push(workSegmentTypeData.color);
  }
  if (workSegmentTypeData.description) {
    query += "description = ?, ";
    values.push(workSegmentTypeData.description);
  }
  if (workSegmentTypeData) {
    query += "updated_at = ?, ";
    values.push(CURRENT_UNIX);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  values.push(id);

  const result: any = await db.query(query, values);
  if (result[0].affectedRows === 0) {
    throw new Error(`Work Segment Type with ID ${id} does not exist`);
  }

  return { message: "Successfully updated work segment type" };
}

async function deleteWorkSegmentType(id: bigint): Promise<{ message: string }> {
  const query = "DELETE FROM work_segment_types WHERE id = ?";
  const result: any = await db.query(query, [id]);

  if (result[0].affectedRows === 0) {
    throw new Error(`Work Segment Type with ID ${id} does not exist`);
  }

  return { message: "Successfully deleted work segment type" };
}

export {
  createWorkSegmentType,
  updateWorkSegmentType,
  deleteWorkSegmentType,
  fetchAllWorkSegmentTypes,
  fetchWorkSegmentTypeById,
};
