import { ME_QK } from "@/constant"
import { useStores } from "@/models"
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query"
import { api } from "../api"
import { MeResponse } from "../schema/me"

export const useMe = (
  options?: UseQueryOptions<MeResponse, Error>,
): UseQueryResult<MeResponse, Error> => {
  const {
    authenticationStore: { sid },
  } = useStores()

  return useQuery({
    queryFn: () => api.me({ sid: sid! }),
    queryKey: ME_QK,
    ...options,
  })
}
