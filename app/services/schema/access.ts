import { z } from "zod"

export const SidRequestSchema = z.object({
  sid: z.string(),
})

export const SidAccessTokenRequestSchema = z.object({
  sid: z.string(),
  accessToken: z.string(),
})

export const SidUidRequestSchema = z.object({
  sid: z.string(),
  uid: z.string(),
})

export type SidRequest = z.infer<typeof SidRequestSchema>
export type SidAccessTokenRequest = z.infer<typeof SidAccessTokenRequestSchema>
export type SidUidRequest = z.infer<typeof SidUidRequestSchema>
