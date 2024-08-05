import { updateClient } from "../../adapters/repositories/clientRepository";
import Client from "../../entity/client";

async function clientUpdateUseCase(
  clientId: bigint,
  updatedClientData: Client
): Promise<{ message: string }> {
  return await updateClient(clientId, updatedClientData);
}

export default clientUpdateUseCase;
