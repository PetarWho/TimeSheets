import { fetchClientById } from "../../adapters/repositories/clientRepository";
import Client from "../../entity/client";

async function clientFetchByIdUseCase(
  clientId: bigint
): Promise<Client | null> {
  const clientData = await fetchClientById(clientId);

  if (clientData) {
    const client = new Client(
      clientData.id,
      clientData.name,
      clientData.created_at,
      clientData.updated_at
    );
    return client;
  } else {
    return null;
  }
}

export default clientFetchByIdUseCase;
