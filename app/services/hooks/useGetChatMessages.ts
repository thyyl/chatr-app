import { CHAT_MESSAGES_QK } from "@/constant"
import { useStores } from "@/models"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { api } from "../api"
import { ChatMessagesResponse } from "../schema/chat"

interface UseGetChatMessagesOptions {
  enabled?: boolean
}

export const useGetChatMessages = (
  options?: UseGetChatMessagesOptions,
): UseQueryResult<ChatMessagesResponse, Error> => {
  const {
    authenticationStore: { sid, authToken },
  } = useStores()

  return useQuery({
    queryFn: () => api.getChatMessages({ sid: sid!, accessToken: authToken! }),
    queryKey: CHAT_MESSAGES_QK,
    ...options,
  })
}
