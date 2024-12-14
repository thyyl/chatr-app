/**
 * The options used to configure websocket
 */
export interface WebSocketConfig {
  /**
   * The URL of the websocket
   */
  wsUrl: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number

  /**
   * Reconnection flag
   * */
  reconnection: boolean

  /**
   * The number of reconnection attempts
   * */
  reconnectionAttempts?: number
}
