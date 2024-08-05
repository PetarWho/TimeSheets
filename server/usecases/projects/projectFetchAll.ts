import Project from "../../entity/project";

import {
  fetchAllProjects,
  fetchProjectsByUserId,
} from "../../adapters/repositories/projectRepository";
import {
  getUserIdFromToken,
  isAdminOrManager,
} from "../../utils/reusableFunctions";
import userFetchRoleIdUseCase from "../users/userFetchRoleId";
import BaseQueryParams from "../../ interfaces/baseQueryParams";

async function projectFetchAllUseCase(
  token: string,
  params: BaseQueryParams
): Promise<Project[]> {
  const userId = await getUserIdFromToken(token);
  if (!userId) {
    throw new Error("Invalid User!");
  }

  const roleId = await userFetchRoleIdUseCase(BigInt(userId));
  if (!roleId) {
    throw new Error("Invalid Role!");
  }

  let allProjects: Project[] = [];

  if (await isAdminOrManager(roleId)) {
    allProjects = await fetchAllProjects(params);
  } else {
    allProjects = await fetchProjectsByUserId(BigInt(userId));
  }

  const projects = allProjects.map(
    (projectData: Project) =>
      new Project(
        projectData.id,
        projectData.name,
        projectData.client_id,
        projectData.created_at,
        projectData.updated_at
      )
  );
  return projects;
}

export default projectFetchAllUseCase;
