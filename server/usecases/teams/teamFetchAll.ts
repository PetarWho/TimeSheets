import { fetchAllTeams } from "../../adapters/repositories/teamRepository";
import Team from "../../entity/team";
import BaseQueryParams from "../../ interfaces/baseQueryParams";
import {
  getUserIdFromToken,
  isAdminOrManager,
} from "../../utils/reusableFunctions";
import userFetchRoleIdUseCase from "../users/userFetchRoleId";
import { fetchTeamsByUserId } from "../../adapters/repositories/teamRepository";

async function teamFetchAllUseCase(
  token: string,
  params: BaseQueryParams
): Promise<Team[]> {
  const userId = await getUserIdFromToken(token);
  if (!userId) {
    throw new Error("Invalid User!");
  }

  const roleId = await userFetchRoleIdUseCase(BigInt(userId));
  if (!roleId) {
    throw new Error("Invalid Role!");
  }

  let allTeams: Team[] = [];

  if (await isAdminOrManager(roleId)) {
    allTeams = await fetchAllTeams(params);
  } else {
    allTeams = await fetchTeamsByUserId(BigInt(userId));
  }

  const teams = allTeams.map(
    (teamData) =>
      new Team(
        teamData.id,
        teamData.project_id,
        teamData.name,
        teamData.description,
        teamData.created_at,
        teamData.updated_at
      )
  );
  return teams;
}

export default teamFetchAllUseCase;
