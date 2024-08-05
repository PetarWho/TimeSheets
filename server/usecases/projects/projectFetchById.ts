import Project from "../../entity/project";
import { fetchProjectById } from "../../adapters/repositories/projectRepository";

async function projectFetchByIdUseCase(
  projectId: bigint
): Promise<Project | null> {
  const projectData = await fetchProjectById(projectId);

  if (!projectData) {
    return null;
  }

  const project = new Project(
    projectData.id,
    projectData.name,
    projectData.client_id,
    projectData.created_at,
    projectData.updated_at
  );
  return project;
}

export default projectFetchByIdUseCase;
