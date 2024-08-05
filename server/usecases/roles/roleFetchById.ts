import Role from "../../entity/role";
import { fetchRoleById } from "../../adapters/repositories/roleRepository";

async function roleFetchByIdUseCase(roleId: bigint): Promise<Role | null> {
  const roleData = await fetchRoleById(roleId);

  if (!roleData) {
    return null;
  }

  const role = new Role(roleData.id, roleData.name);
  return role;
}

export default roleFetchByIdUseCase;
