import type { Account } from "$lib/account.model";
import { Collection, MongoClient } from "mongodb";

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_HOST = process.env.MONGODB_HOST;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

const URL = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}`;
const client = new MongoClient(URL);

async function getAccountCollection(): Promise<Collection<Account>> {
  await client.connect();
  return client.db().collection<Account>("accounts");
}

export default { getAccountCollection };
