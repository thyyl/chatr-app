import { useStores } from "@/models"
import { useChatRoomSubscription, useGetOnlineUsers } from "@/services/hooks"
import { useAppTheme } from "@/utils/useAppTheme"
import { useFocusEffect } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { FC, RefObject, useCallback, useEffect, useRef } from "react"
import { AppState, AppStateStatus, TextInput, View } from "react-native"
import { GiftedChat, IMessage } from "react-native-gifted-chat"
import { AppStackScreenProps } from "../../navigators"
import { ChatHeader } from "./components/ChatHeader"
import { ChatInputToolBar, SendButton } from "./components/ChatInputToolBar"
import { $contentContainer, $screenContentContainer } from "./styles"

interface ChatRoomScreenProps extends AppStackScreenProps<"ChatRoom"> {}

export const ChatRoomScreen: FC<ChatRoomScreenProps> = observer(function ChatRoomScreen(_props) {
  const textInputRef: RefObject<TextInput> = useRef(null)
  const { themed } = useAppTheme()
  const {
    authenticationStore: { userId },
  } = useStores()

  const {
    chatMessages,
    isOnline,
    isTyping: isOtherUserTyping,
    handleOnChatMessage,
    handleOnTyping,
    handleOnChatSeen,
  } = useChatRoomSubscription()
  const { isLoading } = useGetOnlineUsers({
    enabled: isOnline,
  })

  useFocusEffect(
    useCallback(() => {
      handleOnChatSeen()
    }, [handleOnChatSeen]),
  )

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        handleOnChatSeen()
      }
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [handleOnChatSeen])

  const onSend = useCallback(
    (newMessage: IMessage) => {
      handleOnChatMessage(newMessage)
      textInputRef.current?.clear()
    },
    [handleOnChatMessage],
  )

  if (isLoading) {
    return null
  }

  return (
    <View style={themed($screenContentContainer)}>
      <ChatHeader isOnline={isOnline} />
      <GiftedChat
        textInputRef={textInputRef}
        messages={chatMessages}
        user={{ _id: userId }}
        bottomOffset={-24}
        isTyping={isOtherUserTyping}
        messagesContainerStyle={themed($contentContainer)}
        renderInputToolbar={(props) => <ChatInputToolBar {...props} />}
        renderAvatar={null}
        showUserAvatar={false}
        renderSend={(sendProps) => <SendButton {...sendProps} onSend={onSend} />}
        onInputTextChanged={handleOnTyping}
      />
    </View>
  )
})
