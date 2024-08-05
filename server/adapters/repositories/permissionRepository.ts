import Permission from "../../entity/permission";
import db from "../../dbConfig";

async function fetchAllPermissions(): Promise<Permission[]> {
  const query = "SELECT * FROM permissions";
  const [Permissions]: any = await db.query(query);
  return Permissions;
}

async function fetchPermissionByExactName(name: string): Promise<Permission> {
  const query = "SELECT * FROM permissions WHERE name = ?";
  const [Permissions]: any = await db.query(query, [name]);
  return Permissions[0];
}
async function fetchPermissionById(id: bigint): Promise<Permission> {
  const query = "SELECT * FROM permissions WHERE id = ?";
  const [Permissions]: any = await db.query(query, [id]);
  return Permissions[0];
}

async function fetchMultiplePermissions(input: string): Promise<Permission[]> {
  if (!input) {
    throw new Error("Input required");
  }
  const query = "SELECT * FROM permissions WHERE LOWER(name) LIKE ?";
  const [perms]: any = await db.query(query, [`%${input.toLowerCase()}%`]);
  return perms;
}

export {
  fetchPermissionByExactName,
  fetchAllPermissions,
  fetchPermissionById,
  fetchMultiplePermissions,
};
