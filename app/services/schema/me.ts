import { z } from "zod"

export const MeRequestSchema = z.object({
  sid: z.string().optional(),
})

export const MeResponseSchema = z.object({
  id: z.string().default(""),
  name: z.string().default(""),
  photo: z.string().default(""),
})

export type MeRequest = z.infer<typeof MeRequestSchema>
export type MeResponse = z.infer<typeof MeResponseSchema>
