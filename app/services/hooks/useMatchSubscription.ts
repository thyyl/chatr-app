import Config from "@/config"
import { MatchUrl } from "@/constant"
import { useStores } from "@/models"
import { useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"
import { MatchResponseSchema } from "../schema"

export const useMatchSubscription = () => {
  const WEBSOCKET_MATCH_URL = new URL(MatchUrl, Config.WEBSOCKET_URL).toString()

  const [isConnected, setIsConnected] = useState(false)
  const {
    authenticationStore: { setAuthToken },
  } = useStores()
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    isConnected ? WEBSOCKET_MATCH_URL : null,
    {
      shouldReconnect: () => true,
      reconnectInterval: 3000,
    },
  )

  useEffect(() => {
    if (!lastMessage) {
      return
    }

    const message = JSON.parse(lastMessage.data)
    const result = MatchResponseSchema.safeParse(message)

    if (result.success) {
      setAuthToken(result.data.accessToken)
    }
  }, [lastMessage, setAuthToken])

  const connect = () => {
    setIsConnected(true)
  }

  const disconnect = () => {
    setIsConnected(false)
  }

  const toggleConnection = () => {
    setIsConnected((prev) => !prev)
  }

  return {
    sendMessage,
    readyState,
    isConnected,
    connect,
    disconnect,
    toggleConnection,
  }
}
