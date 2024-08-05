import Client from "../../entity/client";
import db from "../../dbConfig";
import { CURRENT_UNIX } from "../../utils/datesHelper";
import BaseQueryParams from "../../ interfaces/baseQueryParams";

async function createClient(clientData: Client): Promise<{ message: string }> {
  if (!clientData.name) {
    throw new Error("Invalid client data");
  }
  const query =
    "INSERT INTO clients (name, created_at, updated_at) VALUES (?, ?, ?)";
  await db.query(query, [clientData.name, CURRENT_UNIX, CURRENT_UNIX]);
  return { message: "Successfully created client" };
}

async function fetchAllClients(params: BaseQueryParams): Promise<Client[]> {
  let query = "SELECT * FROM clients";
  const queryParams: any[] = [];

  const whereClause: string[] = [];

  if (params.search) {
    whereClause.push("(name LIKE ?)");
    const searchPattern = `%${params.search}%`;
    queryParams.push(searchPattern);
  }
  if (whereClause.length > 0) {
    query += " WHERE " + whereClause.join(" AND ");
  }

  if (params.page !== undefined && params.pageSize !== undefined) {
    const offset = params.page * params.pageSize;
    query += " LIMIT ? OFFSET ?";
    queryParams.push(params.pageSize, offset);
  }

  const [clients]: any = await db.query(query, queryParams);
  return clients as Client[];
}

async function fetchMultipleClients(input: string): Promise<Client[]> {
  if (!input) {
    throw new Error("Input required");
  }
  const query = "SELECT * FROM clients WHERE LOWER(name) LIKE ?";
  const [clients]: any = await db.query(query, [`%${input.toLowerCase()}%`]);
  return clients;
}

async function fetchClientById(id: bigint): Promise<Client> {
  const query = "SELECT * FROM clients WHERE id = ?";
  const [clients]: any = await db.query(query, [id]);
  return clients[0];
}

async function updateClient(
  id: bigint,
  clientData: Client
): Promise<{ message: string }> {
  let query = "UPDATE clients SET ";
  const values = [];

  if (clientData.name) {
    query += "name = ?, updated_at = ?, ";
    values.push(clientData.name, CURRENT_UNIX);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  values.push(id);

  const result: any = await db.query(query, values);
  if (result[0].affectedRows === 0) {
    throw new Error(`Client with ID ${id} does not exist`);
  }
  return { message: "Successfully updated client" };
}

async function deleteClient(id: bigint): Promise<{ message: string }> {
  const query = "DELETE FROM clients WHERE id = ?";
  const result: any = await db.query(query, [id]);
  if (result[0].affectedRows === 0) {
    throw new Error(`Client with ID ${id} does not exist`);
  }
  return { message: "Successfully deleted client" };
}

export {
  createClient,
  fetchAllClients,
  fetchMultipleClients,
  fetchClientById,
  updateClient,
  deleteClient,
};
