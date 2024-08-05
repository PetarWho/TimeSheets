import Role from "../../entity/role";
import db from "../../dbConfig";

async function fetchAllRoles(): Promise<Role[]> {
  const query = "SELECT * FROM roles";
  const [roles]: any = await db.query(query);
  return roles;
}

async function fetchRoleById(id: bigint): Promise<Role> {
  const query = "SELECT * FROM roles WHERE id = ?";
  const [roles]: any = await db.query(query, [id]);
  return roles[0];
}

async function fetchRoleByName(name: string): Promise<Role> {
  const query = "SELECT * FROM roles WHERE name = ?";
  const [roles]: any = await db.query(query, [name]);
  return roles[0];
}

export { fetchAllRoles, fetchRoleById, fetchRoleByName };
