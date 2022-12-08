import pool from "$lib/database/pg";
import type { Position } from "$lib/geo/geo.types";
import type { Account, AccountUpdateOptions } from "./account.model";

export async function findAccountByEmail(email: string): Promise<Account | undefined> {
  const query = "SELECT * FROM Account WHERE email ilike $1";
  const result = await pool.query<Account>(query, [email]);

  if (result.rows.length !== 1) {
    return;
  }

  return result.rows[0];
}

export async function usernameExists(username: string): Promise<boolean> {
  const query = "SELECT EXISTS(SELECT * FROM account WHERE username ILIKE $1)";
  const result = await pool.query(query, [username]);

  return result.rows[0].exists;
}

export async function findAccountById(id: number): Promise<Account | undefined> {
  const query = "SELECT * FROM Account WHERE id = $1";
  const result = await pool.query<Account>(query, [id]);

  if (result.rows.length !== 1) {
    console.error("Expected exact one account for id (%s) but got: (%s)", id, result.rows.length);
    return;
  }

  return result.rows[0];
}

export async function insertAccount(account: Account, position?: Position): Promise<number | undefined> {
  const query = account.dealer
    ? "INSERT INTO account (email, password, dealer, company_name, street, house_number, city, zip, tax_id, phone, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ST_POINT($11, $12)) RETURNING id"
    : "INSERT INTO account (email, password, dealer, username, age, gender) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";

  const values = account.dealer
    ? [
        account.email,
        account.password,
        account.dealer,
        account.company_name,
        account.street,
        account.house_number,
        account.city,
        account.zip,
        account.tax_id,
        account.phone,
        position?.longitude,
        position?.latitude
      ]
    : [account.email, account.password, account.dealer, account.username, account.age, account.gender];

  const result = await pool.query<Account>(query, values);

  return result.rows[0].id;
}

export async function updateAccount(id: number, update: AccountUpdateOptions) {
  const values = Object.values(update);
  const setCondition = Object.keys(update)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");

  const query = `UPDATE account
                 SET ${setCondition}
                 WHERE id = $1`;

  await pool.query(query, [id, ...values]);
}
