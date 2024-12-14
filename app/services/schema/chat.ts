import { z } from "zod"

export const EventActionRequestSchema = z.object({
  payload: z.enum(["istyping", "endtyping", "joined", "waiting", "offline"]),
  event: z.number(),
  userId: z.string(),
})

export const EventTextRequestSchema = z.object({
  payload: z.string(),
  event: z.number(),
  userId: z.string(),
})

export const EventSeenRequestSchema = z.object({
  payload: z.union([z.string(), z.number()]),
  event: z.number(),
  userId: z.string(),
})

export const ChatResponseSchema = z.object({
  messageId: z.string(),
  payload: z.string(),
  event: z.number(),
  userId: z.string(),
  seen: z.boolean(),
  time: z.number(),
})

export const ChatMessagesResponseSchema = z.object({
  nextPageState: z.string(),
  messages: z.array(ChatResponseSchema),
})

export type ChatResponse = z.infer<typeof ChatResponseSchema>
export type EventTextRequest = z.infer<typeof EventTextRequestSchema>
export type EventActionRequest = z.infer<typeof EventActionRequestSchema>
export type EventSeenRequest = z.infer<typeof EventSeenRequestSchema>
export type ChatMessagesResponse = z.infer<typeof ChatMessagesResponseSchema>
