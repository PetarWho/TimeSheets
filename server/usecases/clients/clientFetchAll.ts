import BaseQueryParams from "../../ interfaces/baseQueryParams";
import { fetchAllClients } from "../../adapters/repositories/clientRepository";
import Client from "../../entity/client";

async function clientFetchAllUseCase(
  params: BaseQueryParams
): Promise<Client[]> {
  const allClients: Client[] = await fetchAllClients(params);
  const clients = allClients.map(
    (clientData: Client) =>
      new Client(
        clientData.id,
        clientData.name,
        clientData.created_at,
        clientData.updated_at
      )
  );
  return clients;
}

export default clientFetchAllUseCase;
