import Role from "../../entity/role";
import { fetchRoleByName } from "../../adapters/repositories/roleRepository";

async function roleFetchByIdUseCase(roleName: string): Promise<Role | null> {
  const roleData = await fetchRoleByName(roleName);

  if (!roleData) {
    return null;
  }

  const role = new Role(roleData.id, roleData.name);
  return role;
}

export default roleFetchByIdUseCase;
