import { fetchTeamById } from "../../adapters/repositories/teamRepository";
import Team from "../../entity/team";

async function teamFetchByIdUseCase(teamId: bigint): Promise<Team | null> {
  const teamData = await fetchTeamById(teamId);

  if (!teamData) {
    console.log(`No team found with ID: ${teamId}`);
    return null;
  }

  const team = new Team(
    teamData.id,
    teamData.project_id,
    teamData.name,
    teamData.description,
    teamData.created_at,
    teamData.updated_at
  );
  return team;
}

export default teamFetchByIdUseCase;
