import Team from "../../entity/team";
import db from "../../dbConfig";
import BaseQueryParams from "../../ interfaces/baseQueryParams";
import { CURRENT_UNIX } from "../../utils/datesHelper";
import {
  addCalendarQueries,
  addPaginatorQueries,
} from "../../utils/repoQueryFunctions";
import CalendarQueryParams from "../../ interfaces/calendarQueryParams";

async function createTeam(teamData: Team): Promise<{ message: string }> {
  const query =
    "INSERT INTO teams (project_id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
  await db.query(query, [
    teamData.project_id,
    teamData.name,
    teamData.description,
    CURRENT_UNIX,
    CURRENT_UNIX,
  ]);
  return { message: "Successfully created team" };
}

async function fetchAllTeams(params: BaseQueryParams): Promise<Team[]> {
  let query = "SELECT * FROM teams";
  const queryParams: any[] = [];

  if (params.search) {
    query += " WHERE name LIKE ?";
    queryParams.push(`%${params.search}%`);
  }
  query = addPaginatorQueries(params.page, params.pageSize, query, queryParams);

  const [teams]: any = await db.query(query, queryParams);
  return teams as Team[];
}

async function fetchTeamById(id: bigint): Promise<Team> {
  const query = "SELECT * FROM teams WHERE id = ?";
  const [teams]: any = await db.query(query, [id]);
  return teams[0];
}

async function fetchTeamsCount(
  params: CalendarQueryParams,
  userId: bigint | undefined
): Promise<number> {
  let query: string;
  const queryParams: bigint[] = [];
  const whereClause: string[] = [];

  if (userId) {
    query = `
      SELECT COUNT(DISTINCT t.id)
      FROM teams t
      JOIN team_memberships tm ON t.id = tm.team_id
    `;
    whereClause.push("tm.user_id = ?");
    queryParams.push(userId);
  } else {
    query = "SELECT COUNT(*) FROM teams";
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
  return queryResponse[0]["COUNT(DISTINCT t.id)"];
}

async function fetchTeamsByUserId(userId: bigint): Promise<Team[]> {
  const query = `
  SELECT DISTINCT t.*
  FROM teams t
  JOIN team_memberships tm ON t.id = tm.team_id
  WHERE tm.user_id = ?;
  `;
  const [teams]: any = await db.query(query, [userId]);
  return teams;
}

async function updateTeam(
  id: bigint,
  teamData: Team
): Promise<{ message: string }> {
  let query = "UPDATE teams SET ";
  const values = [];

  if (teamData.project_id) {
    query += "project_id = ?, ";
    values.push(teamData.project_id);
  }
  if (teamData.name) {
    query += "name = ?, ";
    values.push(teamData.name);
  }
  if (teamData.description) {
    query += "description = ?, ";
    values.push(teamData.description);
  }
  if (teamData) {
    query += "updated_at = ?, ";
    values.push(CURRENT_UNIX);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  values.push(id);

  const result: any = await db.query(query, values);
  if (result[0].affectedRows === 0) {
    throw new Error(`Team with ID ${id} does not exist`);
  }

  return { message: "Successfully updated team" };
}

async function deleteTeam(id: bigint): Promise<{ message: string }> {
  const query = "DELETE FROM teams WHERE id = ?";
  const result: any = await db.query(query, [id]);

  if (result[0].affectedRows === 0) {
    throw new Error(`Team with ID ${id} does not exist`);
  }
  return { message: "Successfully deleted team" };
}

export {
  createTeam,
  updateTeam,
  deleteTeam,
  fetchAllTeams,
  fetchTeamById,
  fetchTeamsByUserId,
  fetchTeamsCount,
};
