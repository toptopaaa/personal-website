import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { isOwnerEmail, OWNER_EMAIL } from "@/lib/auth/policy";

const teamDomain = () => process.env.CF_ACCESS_TEAM_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
const audience = () => process.env.CF_ACCESS_AUDIENCE;

export async function hasOwnerSession(): Promise<boolean> {
  const requestHeaders = await headers();
  const jwt = requestHeaders.get("cf-access-jwt-assertion");
  const domain = teamDomain();
  const aud = audience();
  if (!jwt || !domain || !aud) return false;

  try {
    const issuer = `https://${domain}`;
    const { payload } = await jwtVerify(jwt, createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`)), {
      issuer,
      audience: aud,
    });
    return isOwnerEmail(typeof payload.email === "string" ? payload.email : null);
  } catch {
    return false;
  }
}

export async function requireOwner(): Promise<void> {
  if (!(await hasOwnerSession())) redirect("/admin/login");
}

export function ownerEmail(): string {
  return OWNER_EMAIL;
}
