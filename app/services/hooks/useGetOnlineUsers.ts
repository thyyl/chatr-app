import { CHAT_ONLINE_USERS_QK, USER_DETAILS_QK } from "@/constant"
import { useStores } from "@/models"
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { api } from "../api"
import { OnlineUsersResponse } from "../schema/online-users"

interface UseGetOnlineUsersOptions {
  enabled?: boolean
}

export const useGetOnlineUsers = (
  options?: UseGetOnlineUsersOptions,
): UseQueryResult<OnlineUsersResponse, Error> => {
  const {
    authenticationStore: { sid, authToken, userId },
    chatStore: { setUserId },
  } = useStores()
  const queryClient = useQueryClient()

  return useQuery({
    queryFn: async () => {
      const data = await api.getOnlineUsers({ sid: sid!, accessToken: authToken! })

      const { userIds } = data
      const friendIds = userIds.filter((id) => id !== userId)
      setUserId(friendIds[0])

      queryClient.invalidateQueries({ queryKey: USER_DETAILS_QK })

      return data
    },
    queryKey: CHAT_ONLINE_USERS_QK,
    ...options,
  })
}
