import { z } from "zod"

export const MatchResponseSchema = z.object({
  accessToken: z.string().min(1),
})

export type MatchResponse = z.infer<typeof MatchResponseSchema>
