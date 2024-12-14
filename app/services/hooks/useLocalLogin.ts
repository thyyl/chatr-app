import { useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query"
import { api } from "../api"
import { LocalLoginRequest, LocalLoginResponse } from "../schema"

export const useLocalLogin = (
  options?: UseMutationOptions<LocalLoginResponse, Error, LocalLoginRequest, unknown>,
): UseMutationResult<LocalLoginResponse, Error, LocalLoginRequest> => {
  return useMutation<LocalLoginResponse, Error, LocalLoginRequest>({
    mutationFn: (request) => api.localLogin(request),
    ...options,
  })
}
