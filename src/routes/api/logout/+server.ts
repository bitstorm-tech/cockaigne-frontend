export async function GET() {
  const headers = new Headers();
  headers.append("set-cookie", "jwt=; SameSite=Lax; Path=/; HttpOnly");
  const options = { headers };

  return new Response(null, options);
}
