import PermissionRole from "../../entity/permissionRole";
import db from "../../dbConfig";

async function createPermissionRole(
  permissionRoleData: PermissionRole
): Promise<{ message: string }> {
  const query =
    "INSERT INTO permissions_roles (role_id, permission_id) VALUES (?, ?)";
  await db.query(query, [
    permissionRoleData.role_id,
    permissionRoleData.permission_id,
  ]);
  return { message: "Successfully created permission role" };
}

async function deletePermissionRole(id: bigint): Promise<{ message: string }> {
  const query = "DELETE FROM permissions_roles WHERE id = ?";
  const result: any = await db.query(query, [id]);
  if (result[0].affectedRows === 0) {
    throw new Error(`Such permission role does not exist`);
  }
  return { message: "Successfully deleted permission role" };
}

async function fetchPermissionRoleByRoleId(
  role_id: bigint
): Promise<PermissionRole[]> {
  const query = "SELECT * FROM permissions_roles WHERE role_id = ?";
  const [permissionRoles]: any = await db.query(query, [role_id]);
  return permissionRoles;
}

async function fetchPermissionRoleByPermissionId(
  permission_id: bigint
): Promise<PermissionRole[]> {
  const query = "SELECT * FROM permissions_roles WHERE permission_id = ?";
  const [permissionRoles]: any = await db.query(query, [permission_id]);
  return permissionRoles;
}

async function checkPermissionForRole(
  permission_id: bigint,
  role_id: bigint
): Promise<boolean> {
  const query =
    "SELECT * FROM permissions_roles WHERE permission_id = ? AND role_id = ?";
  const [permissionRoles]: any = await db.query(query, [
    permission_id,
    role_id,
  ]);
  return permissionRoles.length > 0;
}

export {
  createPermissionRole,
  deletePermissionRole,
  fetchPermissionRoleByRoleId,
  fetchPermissionRoleByPermissionId,
  checkPermissionForRole,
};
