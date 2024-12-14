import { HEADERS } from "apisauce"

export function extractSid(headers?: HEADERS): string | null {
  if (!headers) return null

  const setCookie = headers["set-cookie"]

  if (Array.isArray(setCookie)) {
    const sidCookie = setCookie[0]
    return sidCookie.split("sid=")[1].split(";")[0]
  }

  return null
}
