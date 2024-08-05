import Client from "../../entity/client";
import { createClient } from "../../adapters/repositories/clientRepository";

async function clientCreateUseCase(
  clientData: Client
): Promise<{ message: string }> {
  return await createClient(clientData);
}

export default clientCreateUseCase;
