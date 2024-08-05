import TeamMembership from "../../entity/teamMembership";
import db from "../../dbConfig";

async function createTeamMembership(
  teamMembershipData: TeamMembership
): Promise<{ message: string }> {
  const query = "INSERT INTO team_memberships (team_id, user_id) VALUES (?, ?)";
  await db.query(query, [
    teamMembershipData.team_id,
    teamMembershipData.user_id,
  ]);
  return { message: "Successfully created team memberships" };
}

async function fetchAllTeamMemberships(): Promise<TeamMembership[]> {
  const query = "SELECT * FROM team_memberships";
  const [teamMemberships]: any = await db.query(query);
  return teamMemberships;
}

async function fetchTeamMembershipByTeamId(
  team_id: bigint
): Promise<TeamMembership[]> {
  const query = "SELECT * FROM team_memberships WHERE team_id = ?";
  const [teamMemberships]: any = await db.query(query, [team_id]);
  return teamMemberships;
}

async function fetchTeamMembershipByUserId(
  user_id: bigint
): Promise<TeamMembership[]> {
  const query = "SELECT * FROM team_memberships WHERE user_id = ?";
  const [teamMemberships]: any = await db.query(query, [user_id]);
  return teamMemberships;
}

async function fetchTeamMembershipById(id: bigint): Promise<TeamMembership> {
  const query = "SELECT * FROM team_memberships WHERE id = ?";
  const [teamMemberships]: any = await db.query(query, [id]);
  return teamMemberships[0];
}

async function updateTeamMembership(
  id: bigint,
  teamMembershipData: TeamMembership
): Promise<{ message: string }> {
  let query = "UPDATE team_memberships SET ";
  const values = [];

  if (teamMembershipData.team_id) {
    query += "team_id = ?, ";
    values.push(teamMembershipData.team_id);
  }
  if (teamMembershipData.user_id) {
    query += "user_id = ?, ";
    values.push(teamMembershipData.user_id);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  values.push(id);

  const result: any = await db.query(query, values);
  if (result[0].affectedRows === 0) {
    throw new Error(`Such team membership does not exist`);
  }

  return { message: "Successfully updated team membership" };
}

async function deleteTeamMembership(id: bigint): Promise<{ message: string }> {
  const query = "DELETE FROM team_memberships WHERE id = ?";

  const result: any = await db.query(query, [id]);
  if (result[0].affectedRows === 0) {
    throw new Error(`Such team membership does not exist`);
  }

  return { message: "Successfully deleted team membership" };
}

export {
  createTeamMembership,
  updateTeamMembership,
  deleteTeamMembership,
  fetchTeamMembershipByUserId,
  fetchTeamMembershipByTeamId,
  fetchTeamMembershipById,
  fetchAllTeamMemberships,
};
