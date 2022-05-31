import pool from "$lib/database/pg";
import type { Account } from "./account.model";

export async function findAccountByEmail(email: string): Promise<Account | undefined> {
  const result = await pool.query<Account>("SELECT * FROM Account WHERE email = $1", [email]);

  if (result.rows.length !== 1) {
    console.error("Expected exact one account for eMail (%s) but got :", email, result.rows.length);
    return null;
  }

  return result.rows[0];
}

export async function findAccountById(id: number): Promise<Account | undefined> {
  const result = await pool.query<Account>("SELECT * FROM Account WHERE id = $1", [id]);

  if (result.rows.length !== 1) {
    console.error("Expected exact one account for id (%s) but got :", id, result.rows.length);
    return null;
  }

  return result.rows[0];
}
