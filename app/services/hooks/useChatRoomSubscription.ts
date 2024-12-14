import Config from "@/config"
import { ChatUrl, Events, EventType } from "@/constant"
import { useStores } from "@/models"
import { useCallback, useEffect, useRef, useState } from "react"
import { GiftedChat, IMessage } from "react-native-gifted-chat"
import useWebSocket from "react-use-websocket"
import {
  ChatResponse,
  ChatResponseSchema,
  EventActionRequest,
  EventSeenRequest,
  EventTextRequest,
} from "../schema/chat"
import { useGetChatMessages } from "./useGetChatMessages"

export const useChatRoomSubscription = () => {
  const {
    authenticationStore: { userId, authToken },
  } = useStores()

  const [isOnline, setIsOnline] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [chatMessages, setChatMessages] = useState<IMessage[]>([])
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const WEBSOCKET_CHAT_URL = new URL(ChatUrl, Config.WEBSOCKET_URL)
  WEBSOCKET_CHAT_URL.searchParams.append("uid", userId)
  WEBSOCKET_CHAT_URL.searchParams.append("access_token", authToken!)

  const { sendMessage, lastMessage, readyState } = useWebSocket(WEBSOCKET_CHAT_URL.toString(), {
    reconnectInterval: 3000,
  })
  const { data: channelChatMessages } = useGetChatMessages({
    enabled: readyState === WebSocket.OPEN,
  })

  useEffect(() => {
    if (!channelChatMessages) {
      return
    }

    const { messages } = channelChatMessages
    handleOnChatMessagesLoad(messages)
  }, [channelChatMessages])

  useEffect(() => {
    if (!lastMessage) {
      return
    }

    const parsedData = JSON.parse(lastMessage.data)
    const result = ChatResponseSchema.safeParse(parsedData)

    if (!result.success) {
      console.error("Error parsing chat message", result.error)
      return
    }

    const { data } = result
    const { event } = data

    switch (event) {
      case Events.EventText:
        return handleEventText.current(data)
      case Events.EventAction:
        return handleEventAction.current(data)
      case Events.EventSeen:
        return handleEventSeen.current(data)
    }
  }, [lastMessage])

  const handleEventAction = useRef((event: ChatResponse) => {
    const { payload } = event

    switch (payload) {
      case EventType.IsTyping:
      case EventType.EndTyping:
        return handleTypingEvent(event)
      case EventType.Joined:
        return setIsOnline(true)
      case EventType.Waiting:
      case EventType.Offline:
      default:
        return setIsOnline(false)
    }
  })

  const handleTypingEvent = (event: ChatResponse) => {
    const { payload, userId: eventUserId } = event

    if (userId === eventUserId) {
      return
    }

    switch (payload) {
      case EventType.IsTyping:
        return setIsTyping(true)
      case EventType.EndTyping:
        return setIsTyping(false)
    }
  }

  const handleEventText = useRef((event: ChatResponse) => {
    const chatPayload: IMessage[] = [
      {
        _id: event.messageId,
        text: event.payload,
        createdAt: new Date(event.time),
        sent: true,
        received: event.seen,
        user: {
          _id: event.userId,
        },
      },
    ]

    return setChatMessages((previousMessages) => GiftedChat.append(previousMessages, chatPayload))
  })

  const handleOnChatMessagesLoad = (events: ChatResponse[]) => {
    const chatPayload: IMessage[] = events.map((event) => ({
      _id: event.messageId,
      text: event.payload,
      createdAt: new Date(event.time),
      sent: true,
      received: event.seen,
      user: {
        _id: event.userId,
      },
    }))

    return setChatMessages((previousMessages) => GiftedChat.append(previousMessages, chatPayload))
  }

  const handleEventSeen = useRef((event: ChatResponse) => {
    const { payload, userId: senderId } = event

    if (userId === senderId) {
      return
    }

    setChatMessages((previousMessages) =>
      previousMessages.map((message) => {
        if (message._id === payload) {
          return {
            ...message,
            received: true,
          }
        }

        return message
      }),
    )
  })

  const handleSendMessage = useRef((event: ChatResponse | EventTextRequest | EventSeenRequest) => {
    sendMessage(JSON.stringify(event))
  })

  const sendTypingStatus = (status: EventType.IsTyping | EventType.EndTyping) => {
    const payload: EventActionRequest = {
      event: Events.EventAction,
      payload: status,
      userId,
    }

    handleSendMessage.current(payload)
  }

  const handleOnTyping = (text: string) => {
    if (text.trim().length > 0) {
      sendTypingStatus(EventType.IsTyping)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStatus(EventType.EndTyping)
      }, 1000)
    }
  }

  const handleOnChatSeen = useCallback(() => {
    const unseenChats = chatMessages.filter(
      (message) => !message.received && message.user._id !== userId,
    )

    const unseenChatIds = unseenChats.map((message) => message._id)

    const payloads: EventSeenRequest[] = unseenChatIds.map((messageId) => ({
      event: Events.EventSeen,
      payload: messageId,
      userId,
    }))

    payloads.map((payload) => handleSendMessage.current(payload))
  }, [chatMessages, userId])

  const handleOnChatMessage = (newMessage: IMessage) => {
    const payload: EventTextRequest = {
      event: Events.EventText,
      payload: newMessage.text,
      userId,
    }

    handleSendMessage.current(payload)
  }

  return {
    chatMessages,
    readyState,
    isOnline,
    isTyping,
    handleOnChatMessage,
    handleOnTyping,
    handleOnChatSeen,
  }
}
