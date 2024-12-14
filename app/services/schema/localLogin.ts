import { z } from "zod"

export const LocalLoginRequestSchema = z.object({
  name: z.string(),
})

export const LocalLoginResponseSchema = z.object({
  id: z.string().default(""),
  name: z.string().default(""),
  photo: z.string().default(""),
  sid: z.string().default(""),
})

export type LocalLoginRequest = z.infer<typeof LocalLoginRequestSchema>
export type LocalLoginResponse = z.infer<typeof LocalLoginResponseSchema>
