import { QueryKey } from "@tanstack/react-query"

export const ME_QK = ["USER", "ME"]
export const USER_DETAILS_QK = ["USER", "DETAILS"]
export const USER_DETAILS_ID_QK = (uid: string): QueryKey => ["USER", "DETAILS", uid]
export const CHAT_ONLINE_USERS_QK = ["CHAT", "ONLINE_USERS"]
export const CHAT_MESSAGES_QK = ["CHAT", "CHANNEL", "MESSAGES"]
