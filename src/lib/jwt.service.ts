import type { JWTPayload } from "jose";
import * as jose from "jose";

export async function createJwt(subject: string, payload = {}): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS512" })
    .setIssuedAt()
    .setSubject(subject)
    .sign(secret);
}

export async function extractJwt(requestOrResponse: Request | Response): Promise<JWTPayload | undefined> {
  try {
    const headerKey = requestOrResponse instanceof Request ? "cookie" : "set-cookie";
    const cookie = requestOrResponse.headers.get(headerKey);
    const jwtString =
      cookie
        ?.split(";")
        ?.find((token) => token.trim().startsWith("jwt="))
        ?.split("=")[1] || "";

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const jwt = await jose.jwtVerify(jwtString, secret);

    return jwt?.payload;
  } catch (error) {
    console.error("[jwt.service.ts] JWT verification failed");
  }
}
