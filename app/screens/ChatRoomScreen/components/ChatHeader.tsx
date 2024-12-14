import { Status, Text } from "@/components"
import { useStores } from "@/models"
import { useGetUserDetails } from "@/services/hooks"
import { colors } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import Feather from "@expo/vector-icons/Feather"
import { Avatar } from "@kolking/react-native-avatar"
import { observer } from "mobx-react-lite"
import { FC, Fragment } from "react"
import { TouchableOpacity, View } from "react-native"
import {
  $avatarContainer,
  $contentContainer,
  $headerContainer,
  $headerLoadingContainer,
} from "./styles"

interface ChatHeaderProps {
  isOnline: boolean
}

export const ChatHeader: FC<ChatHeaderProps> = observer(function ChatHeader({ isOnline }) {
  const {
    authenticationStore: { leaveRoom },
    chatStore: { leaveChatRoom, userId },
  } = useStores()

  const { data, isLoading } = useGetUserDetails({
    enabled: !!userId,
  })
  const { themed } = useAppTheme()

  const onLeaveRoom = () => {
    leaveRoom()
    leaveChatRoom()
  }

  return (
    <View style={themed($headerContainer)}>
      <Fragment>
        <TouchableOpacity onPress={onLeaveRoom}>
          <Feather name="chevron-left" size={24} color={colors.palette.primary100} />
        </TouchableOpacity>
        {isLoading || !data ? (
          <View style={themed($headerLoadingContainer)}>
            <Text text="Loading..." />
          </View>
        ) : (
          <View style={themed($contentContainer)}>
            <View style={themed($avatarContainer)}>
              <Avatar name={data.name} size={42} />
              <Status status={isOnline ? "online" : "offline"} />
            </View>
            <Text text={data.name} preset="chatHeader" />
          </View>
        )}
        <TouchableOpacity>
          <Feather name="chevron-left" size={24} color={colors.palette.neutral200} />
        </TouchableOpacity>
      </Fragment>
    </View>
  )
})
