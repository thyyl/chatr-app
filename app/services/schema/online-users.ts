import { z } from "zod"

export const OnlineUsersResponseSchema = z.object({
  userIds: z.array(z.string()),
})

export type OnlineUsersResponse = z.infer<typeof OnlineUsersResponseSchema>
