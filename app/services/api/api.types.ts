/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  httpUrl: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
