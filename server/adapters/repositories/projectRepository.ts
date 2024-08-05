import Project from "../../entity/project";
import db from "../../dbConfig";
import BaseQueryParams from "../../ interfaces/baseQueryParams";
import { CURRENT_UNIX } from "../../utils/datesHelper";
import CalendarQueryParams from "../../ interfaces/calendarQueryParams";
import { addCalendarQueries } from "../../utils/repoQueryFunctions";

async function createProject(
  projectData: Project
): Promise<{ message: string }> {
  const query =
    "INSERT INTO projects (name, client_id, created_at, updated_at) VALUES (?, ?, ?, ?)";
  await db.query(query, [
    projectData.name,
    projectData.client_id,
    CURRENT_UNIX,
    CURRENT_UNIX,
  ]);
  return { message: "Succesfully created project" };
}

async function fetchAllProjects(params: BaseQueryParams): Promise<Project[]> {
  const queryParams: (string | number | bigint)[] = [];

  let query = "SELECT * FROM projects";

  if (params.search) {
    query += " WHERE name LIKE ?";
    queryParams.push(`%${params.search}%`);
  }

  if (params.page !== undefined && params.pageSize !== undefined) {
    const offset = params.page * params.pageSize;
    query += " LIMIT ? OFFSET ?";
    queryParams.push(params.pageSize, offset);
  }

  const [projects]: any = await db.query(query, queryParams);
  return projects as Project[];
}
async function fetchProjectById(id: bigint): Promise<Project> {
  const query = "SELECT * FROM projects WHERE id = ?";
  const [projects]: any = await db.query(query, [id]);
  return projects[0];
}

async function fetchProjectsByUserId(userId: bigint): Promise<Project[]> {
  const query = `
  SELECT DISTINCT p.*
  FROM projects p
  JOIN teams t ON p.id = t.project_id
  JOIN team_memberships tm ON t.id = tm.team_id
  WHERE tm.user_id = ?;
`;
  const [projects]: any = await db.query(query, [userId]);
  return projects;
}

async function fetchProjectsCount(
  params: CalendarQueryParams,
  userId: bigint | undefined
): Promise<number> {
  let query: string;
  const queryParams: bigint[] = [];
  const whereClause: string[] = [];

  if (userId) {
    query = `
      SELECT COUNT(DISTINCT p.id)
      FROM projects p
      JOIN teams t ON p.id = t.project_id
      JOIN team_memberships tm ON t.id = tm.team_id 
    `;
    whereClause.push("tm.user_id = ?");
    queryParams.push(userId);
  } else {
    query = "SELECT COUNT(*) FROM projects";
  }

  query = addCalendarQueries(
    params.startDate,
    params.endDate,
    whereClause,
    queryParams,
    query,
    "created_at"
  );

  const [queryResponse]: any = await db.query(query, queryParams);

  if (queryResponse[0]["COUNT(*)"] || queryResponse[0]["COUNT(*)"] == 0) {
    return queryResponse[0]["COUNT(*)"];
  }

  return queryResponse[0]["COUNT(DISTINCT p.id)"];
}

async function updateProject(
  id: bigint,
  projectData: Project
): Promise<{ message: string }> {
  let query = "UPDATE projects SET ";
  const values = [];

  if (projectData.name) {
    query += "name = ?, ";
    values.push(projectData.name);
  }
  if (projectData.client_id) {
    query += "client_id = ?, ";
    values.push(projectData.client_id);
  }
  if (projectData) {
    query += "updated_at = ?, ";
    values.push(CURRENT_UNIX);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  values.push(id);

  const result: any = await db.query(query, values);
  if (result[0].affectedRows === 0) {
    throw new Error(`Project with ID ${id} does not exist`);
  }
  return { message: "Succesfully updated project" };
}

async function deleteProject(id: bigint): Promise<{ message: string }> {
  const query = "DELETE FROM projects WHERE id = ?";
  const result: any = await db.query(query, [id]);
  if (result[0].affectedRows === 0) {
    throw new Error(`Project with ID ${id} does not exist`);
  }
  return { message: "Succesfully deleted project" };
}

export {
  createProject,
  updateProject,
  deleteProject,
  fetchAllProjects,
  fetchProjectById,
  fetchProjectsCount,
  fetchProjectsByUserId,
};
