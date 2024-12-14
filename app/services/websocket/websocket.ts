import Config from "@/config"
import { MatchUrl } from "@/constant"
import { io, Socket } from "socket.io-client"
import { WebSocketConfig } from "./websocket.types"

/**
 * Configuring the websocket instance.
 */
export const DEFAULT_WS_CONFIG: WebSocketConfig = {
  wsUrl: Config.WEBSOCKET_URL,
  timeout: 10000,
  reconnection: true,
  reconnectionAttempts: 5,
}

/**
 * Default WebSocket configuration
 */
export const DEFAULT_WEBSOCKET_CONFIG: WebSocketConfig = {
  wsUrl: Config.WEBSOCKET_URL,
  timeout: 10000,
  reconnection: true,
  reconnectionAttempts: 5,
}

/**
 * WebSocket Service manages socket connections,
 * event subscriptions, and real-time communication
 */
export class WebSocket {
  private socket: Socket | null = null
  private config: WebSocketConfig
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map()

  constructor(config: WebSocketConfig = DEFAULT_WEBSOCKET_CONFIG) {
    this.config = config
  }

  match(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Disconnect any existing connection
      this.disconnect()
      const matchWebSocketUrl = `${this.config.wsUrl}/${MatchUrl}`

      this.socket = io(matchWebSocketUrl, {
        timeout: this.config.timeout,
        reconnection: this.config.reconnection,
        reconnectionAttempts: this.config.reconnectionAttempts,
      })

      this.socket.on("connect", () => {
        console.log("WebSocket connected")
        resolve()
      })

      this.socket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error)
        reject(error)
      })

      // Setup default event handlers
      this.setupDefaultHandlers()
    })
  }

  /**
   * Establish WebSocket connection
   */
  connect(authToken?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Disconnect any existing connection
      this.disconnect()

      this.socket = io(this.config.wsUrl, {
        timeout: this.config.timeout,
        reconnection: this.config.reconnection,
        reconnectionAttempts: this.config.reconnectionAttempts,
        auth: authToken ? { token: authToken } : {},
      })

      this.socket.on("connect", () => {
        console.log("WebSocket connected")
        resolve()
      })

      this.socket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error)
        reject(error)
      })

      // Setup default event handlers
      this.setupDefaultHandlers()
    })
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  /**
   * Send an event to the server
   * @param eventName Name of the event
   * @param data Payload data
   */
  emit(eventName: string, data: any): void {
    if (!this.socket) {
      throw new Error("WebSocket not connected")
    }

    try {
      const event = {
        event: eventName,
        data,
      }

      this.socket.emit(eventName, event.data)
    } catch (error) {
      console.error("Invalid event data:", error)
      throw error
    }
  }

  /**
   * Subscribe to a specific event
   * @param eventName Name of the event to listen for
   * @param callback Callback function to handle event data
   */
  on(eventName: string, callback: (data: any) => void): () => void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Set())
    }

    const listeners = this.eventListeners.get(eventName)!
    listeners.add(callback)

    // If socket is available, actually attach the listener
    if (this.socket) {
      this.socket.on(eventName, callback)
    }

    // Return an unsubscribe function
    return () => this.off(eventName, callback)
  }

  /**
   * Unsubscribe from a specific event
   * @param eventName Name of the event
   * @param callback Specific callback to remove (optional)
   */
  off(eventName: string, callback?: (data: any) => void): void {
    const listeners = this.eventListeners.get(eventName)

    if (listeners) {
      if (callback) {
        listeners.delete(callback)
        if (this.socket) {
          this.socket.off(eventName, callback)
        }
      } else {
        // Remove all listeners for this event
        listeners.forEach((cb) => {
          if (this.socket) {
            this.socket.off(eventName, cb)
          }
        })
        listeners.clear()
      }
    }
  }

  /**
   * Setup default WebSocket event handlers
   * Customize these as needed for your specific use case
   */
  private setupDefaultHandlers(): void {
    if (!this.socket) return

    this.socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason)
    })

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("WebSocket reconnected after", attemptNumber, "attempts")
    })

    this.socket.on("reconnect_error", (error) => {
      console.error("WebSocket reconnection error:", error)
    })
  }
}

// Singleton instance for convenience
export const websocket = new WebSocket()
