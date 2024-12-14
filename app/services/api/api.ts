/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ChatMessagesUrl, LoginUrl, MeUrl, OnlineUsersUrl, UserDetailsUrl } from "@/constant"
import { extractSid } from "@/utils/sidExtractor"
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import {
  LocalLoginRequest,
  LocalLoginRequestSchema,
  LocalLoginResponse,
  LocalLoginResponseSchema,
  SidAccessTokenRequest,
  SidAccessTokenRequestSchema,
  SidUidRequest,
  SidUidRequestSchema,
  UserResponse,
  UserResponseSchema,
} from "../schema"
import { ChatMessagesResponse, ChatMessagesResponseSchema } from "../schema/chat"
import { MeRequest, MeRequestSchema, MeResponse, MeResponseSchema } from "../schema/me"
import { OnlineUsersResponse, OnlineUsersResponseSchema } from "../schema/online-users"
import type { ApiConfig } from "./api.types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  httpUrl: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.httpUrl,
      timeout: this.config.timeout,
      headers: {
        "Accept": "cd ",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  async localLogin(request: LocalLoginRequest): Promise<LocalLoginResponse> {
    const parsedRequest = LocalLoginRequestSchema.parse(request)

    const response: ApiResponse<LocalLoginResponse> = await this.apisauce.post(
      LoginUrl,
      JSON.stringify(parsedRequest),
    )

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const sid = extractSid(response.headers)
    const result = LocalLoginResponseSchema.parse({
      ...response.data,
      sid,
    })

    return result
  }

  async me(request: MeRequest): Promise<MeResponse> {
    const parsedRequest = MeRequestSchema.parse(request)

    const response: ApiResponse<MeResponse> = await this.apisauce.get(MeUrl, {
      headers: {
        sid: parsedRequest.sid,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get user data")
    }

    const result = MeResponseSchema.parse(response.data)

    return result
  }

  async getOnlineUsers(request: SidAccessTokenRequest): Promise<OnlineUsersResponse> {
    const parsedRequest = SidAccessTokenRequestSchema.parse(request)

    this.apisauce.setHeaders({
      Authorization: `Bearer ${parsedRequest.accessToken}`,
      sid: parsedRequest.sid,
    })

    const response: ApiResponse<MeResponse> = await this.apisauce.get(OnlineUsersUrl, {})

    if (!response.ok) {
      throw new Error("Failed to get online users")
    }

    const result = OnlineUsersResponseSchema.parse(response.data)

    return result
  }

  async getUserDetails(request: SidUidRequest): Promise<UserResponse> {
    const parsedRequest = SidUidRequestSchema.parse(request)

    const response: ApiResponse<UserResponse> = await this.apisauce.get(
      UserDetailsUrl(parsedRequest.uid),
      {
        headers: {
          sid: parsedRequest.sid,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to get user details")
    }

    const result = UserResponseSchema.parse(response.data)

    return result
  }

  async getChatMessages(request: SidAccessTokenRequest): Promise<ChatMessagesResponse> {
    const parsedRequest = SidAccessTokenRequestSchema.parse(request)

    this.apisauce.setHeaders({
      Authorization: `Bearer ${parsedRequest.accessToken}`,
      sid: parsedRequest.sid,
    })

    const response: ApiResponse<UserResponse> = await this.apisauce.get(ChatMessagesUrl)

    if (!response.ok) {
      throw new Error("Failed to get chat messages")
    }

    const result = ChatMessagesResponseSchema.parse(response.data)

    return result
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
