import { USER_DETAILS_ID_QK } from "@/constant"
import { useStores } from "@/models"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { api } from "../api"
import { UserResponse } from "../schema"

interface UseGetUserDetailsOptions {
  enabled?: boolean
}

export const useGetUserDetails = (
  options?: UseGetUserDetailsOptions,
): UseQueryResult<UserResponse, Error> => {
  const {
    authenticationStore: { sid },
    chatStore: { userId },
  } = useStores()

  return useQuery({
    queryFn: () => api.getUserDetails({ sid: sid!, uid: userId }),
    queryKey: USER_DETAILS_ID_QK(userId),
    ...options,
  })
}
