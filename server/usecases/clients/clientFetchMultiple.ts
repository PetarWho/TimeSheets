import Client from "../../entity/client";
import { fetchMultipleClients } from "../../adapters/repositories/clientRepository";

async function clientFetchMultipleUseCase(input: string): Promise<Client[]> {
  const clientData = await fetchMultipleClients(input);

  const clients = clientData.map(
    (data: Client) =>
      new Client(data.id, data.name, data.created_at, data.updated_at)
  );
  return clients;
}

export default clientFetchMultipleUseCase;
