import Role from "../../entity/role";

import { fetchAllRoles } from "../../adapters/repositories/roleRepository";

async function roleFetchAllUseCase(): Promise<Role[]> {
  const rolesData: Role[] = await fetchAllRoles();
  const roles = rolesData.map(
    (roleData: Role) => new Role(roleData.id, roleData.name)
  );
  return roles;
}

export default roleFetchAllUseCase;
