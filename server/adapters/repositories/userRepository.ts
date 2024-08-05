import db from "../../dbConfig";
import User from "../../entity/user";
import UserQueryParams from "../../ interfaces/userQueryParams";
import { CURRENT_UNIX } from "../../utils/datesHelper";

async function createUser(userData: User): Promise<{ message: string }> {
  const query =
    "INSERT INTO users (name, email, password, avatar, email_verified_at, google_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  await db.query(query, [
    userData.name,
    userData.email,
    userData.password,
    userData.avatar,
    userData.email_verified_at,
    userData.google_id,
    CURRENT_UNIX,
    CURRENT_UNIX,
  ]);
  return { message: "Created user succesfully" };
}

async function fetchAllUsers(params: UserQueryParams): Promise<User[]> {
  let query = "SELECT * FROM users";
  const queryParams: any[] = [];

  const whereClause: string[] = [];

  if (params.status) {
    whereClause.push("deactivated = ?");
    queryParams.push(params.status === "active" ? 0 : 1);
  }
  if (params.search) {
    whereClause.push("(name LIKE ? OR email LIKE ?)");
    const searchPattern = `%${params.search}%`;
    queryParams.push(searchPattern, searchPattern);
  }
  if (whereClause.length > 0) {
    query += " WHERE " + whereClause.join(" AND ");
  }

  if (params.page !== undefined && params.pageSize !== undefined) {
    const offset = params.page * params.pageSize;
    query += " LIMIT ? OFFSET ?";
    queryParams.push(params.pageSize, offset);
  }

  const [users]: any = await db.query(query, queryParams);
  return users;
}

async function fetchUserById(id: bigint): Promise<User> {
  const query = "SELECT * FROM users WHERE id = ?";
  const [users]: any[] = await db.query(query, [id]);
  return users[0];
}

async function fetchUsersCount(): Promise<number> {
  const query = "SELECT COUNT(*) FROM users";
  const [queryResponse]: any = await db.query(query);

  return queryResponse[0]["COUNT(*)"];
}

async function fetchUserByEmail(email: string): Promise<User | undefined> {
  const query = "SELECT * FROM users WHERE email = ?";
  const [users]: any[] = await db.query(query, [email]);
  return users[0];
}

async function fetchUserByGoogleId(google_id: string): Promise<User> {
  const query = "SELECT * FROM users WHERE google_id = ?";
  const [users]: any[] = await db.query(query, [google_id]);
  return users[0];
}

async function fetchUsersThatAreNotMembersOfTeam(
  team_id: bigint
): Promise<User[]> {
  const query =
    "SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM team_memberships WHERE team_id = ?);";
  const [users]: any = await db.query(query, [team_id]);
  return users;
}

async function updateUser(
  id: bigint,
  userData: User
): Promise<{ message: string }> {
  let query = "UPDATE users SET ";
  const values = [];

  if (userData.name) {
    query += "name = ?, ";
    values.push(userData.name);
  }
  if (userData.email && !userData.google_id) {
    query += "email = ?, ";
    values.push(userData.email);
  }
  if (userData.email_verified_at) {
    query += "email_verified_at = ?, ";
    values.push(userData.email_verified_at);
  }
  if (userData.password) {
    query += "password = ?, ";
    values.push(userData.password);
  }
  if (userData.remember_token) {
    query += "remember_token = ?, ";
    values.push(userData.remember_token);
  }
  if (userData.google_id) {
    query += "google_id = ?, ";
    values.push(userData.google_id);
  }
  if (userData.avatar) {
    query += "avatar = ?, ";
    values.push(userData.avatar);
  }

  if (userData.deactivated) {
    query += "deactivated = ?, ";
    values.push(userData.deactivated);
  }

  if (userData) {
    query += "updated_at = ?, ";
    values.push(CURRENT_UNIX);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  values.push(id);

  const result: any = await db.query(query, values);
  if (result[0].affectedRows === 0) {
    throw new Error(`User with ID ${id} does not exist`);
  }

  return { message: "Updated user succesfylly" };
}

async function deleteUser(id: bigint): Promise<{ message: string }> {
  const query = "DELETE FROM users WHERE id = ?";
  const result: any = await db.query(query, [id]);
  if (result[0].affectedRows === 0) {
    throw new Error(`User with ID ${id} does not exist`);
  }
  return { message: "Updated user succesfylly" };
}

async function deactivateUser(
  id: bigint,
  value: boolean
): Promise<{ message: string }> {
  const query = "UPDATE users SET deactivated = ? WHERE id = ?";

  const result: any = await db.query(query, [value, id]);
  if (result[0].affectedRows === 0) {
    throw new Error(`User with ID ${id} does not exist`);
  }
  if (value) {
    return { message: "Successfully activated user" };
  } else {
    return { message: "Successfully deactivated user" };
  }
}
async function setRoleOfUser(
  user_id: bigint,
  role_id: bigint
): Promise<{ message: string }> {
  const query = "UPDATE users SET role_id = ? WHERE id = ?";
  const result: any = await db.query(query, [role_id, user_id]);
  if (result[0].affectedRows === 0) {
    throw new Error(`User with ID ${user_id} does not exist`);
  }
  return { message: "Successfully set role" };
}

async function fetchUserRole(id: bigint): Promise<bigint> {
  const query = "SELECT role_id FROM users WHERE id = ?";
  const [role]: any[] = await db.query(query, [id]);

  return role[0].role_id;
}

export {
  createUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
  deleteUser,
  deactivateUser,
  fetchUserByEmail,
  fetchUserByGoogleId,
  fetchUsersCount,
  fetchUserRole,
  setRoleOfUser,
  fetchUsersThatAreNotMembersOfTeam,
};
