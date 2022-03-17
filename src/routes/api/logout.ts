export async function get() {
  const headers = new Headers();
  headers.append("set-cookie", "jwt=; SameSite=Lax; Path=/; HttpOnly");
  headers.append("redirect", "/");

  return {
    status: 302,
    headers
  };
}
