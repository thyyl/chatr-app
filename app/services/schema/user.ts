import { z } from "zod"

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  photo: z.string(),
})

export type UserResponse = z.infer<typeof UserResponseSchema>
