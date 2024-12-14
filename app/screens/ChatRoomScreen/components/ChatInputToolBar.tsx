import { colors } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import AntDesign from "@expo/vector-icons/AntDesign"
import { FC } from "react"
import { View } from "react-native"
import {
  Composer,
  ComposerProps,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
} from "react-native-gifted-chat"
import {
  $chatInputContainer,
  $chatMessageContainer,
  $sendButton,
  $sendButtonContainer,
} from "./styles"

interface ChatInputToolBarProps extends InputToolbarProps<IMessage> {}

export const ChatInputToolBar: FC<ChatInputToolBarProps> = (props) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($chatInputContainer)}>
      <InputToolbar
        {...props}
        renderComposer={(composerProps) => <ComposerInput {...composerProps} />}
        containerStyle={themed($chatMessageContainer)}
      />
    </View>
  )
}

interface ComposerInputProps extends ComposerProps {}

export const ComposerInput: FC<ComposerInputProps> = (props) => {
  return <Composer {...props} placeholder="Type your message" />
}

interface SendButtonProps extends SendProps<IMessage> {
  onSend: (messages: IMessage) => void
}

export const SendButton: FC<SendButtonProps> = (props) => {
  const { onSend } = props
  const { themed } = useAppTheme()

  return (
    <Send {...props} containerStyle={themed($sendButtonContainer)} onSend={onSend}>
      <View style={themed($sendButton)}>
        <AntDesign name="arrowup" size={20} color={colors.background} />
      </View>
    </Send>
  )
}
