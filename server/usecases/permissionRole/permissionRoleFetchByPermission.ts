import { fetchPermissionRoleByPermissionId } from "../../adapters/repositories/permissionRoleRepository";
import PermissionRole from "../../entity/permissionRole";

async function permissionRoleFetchByPermissionIdUseCase(
  permission_id: bigint
): Promise<PermissionRole[]> {
  const allPermissionRoles: PermissionRole[] =
    await fetchPermissionRoleByPermissionId(permission_id);
  const permissionRoles = allPermissionRoles.map(
    (permissionRoleData) =>
      new PermissionRole(
        permissionRoleData.id,
        permissionRoleData.role_id,
        permissionRoleData.permission_id
      )
  );
  return permissionRoles;
}

export default permissionRoleFetchByPermissionIdUseCase;
