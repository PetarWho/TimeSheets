import { deleteClient } from "../../adapters/repositories/clientRepository";

async function clientDeleteUseCase(
  clientId: bigint
): Promise<{ message: string }> {
  return await deleteClient(clientId);
}

export default clientDeleteUseCase;
