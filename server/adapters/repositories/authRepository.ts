import db from "../../dbConfig";
import JWToken from "../../entity/token";
import { JWT_EXPIRATION_DELAY_MILLISECONDS } from "../../utils/jwtConstants";
import { CURRENT_UNIX } from "../../utils/datesHelper";

async function createJWT(
  userId: bigint,
  token: string
): Promise<{ message: string }> {
  const query =
    "INSERT INTO tokens (jwt, user_id, expiry_date) VALUES (?, ?, ?)";
  await db.query(query, [
    token,
    userId,
    CURRENT_UNIX + JWT_EXPIRATION_DELAY_MILLISECONDS,
  ]);
  return { message: "Created user succesfully" };
}

async function deleteJWT(token: string): Promise<{ message: string }> {
  const result: any = await db.query("DELETE FROM tokens WHERE jwt = ?", [
    token,
  ]);
  if (result[0].affectedRows === 0) {
    throw new Error(`Such JWT does not exist`);
  }
  return { message: "Logout successful" };
}

async function findToken(jwt: string): Promise<JWToken> {
  const query = "SELECT * FROM tokens WHERE jwt = ?";
  const [tokens]: any = await db.query(query, [jwt]);
  return tokens[0] as JWToken;
}

export { createJWT, deleteJWT, findToken };
