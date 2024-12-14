import { ActionState } from "@/constant"
import { useMatchSubscription, useMe } from "@/services/hooks"
import { useAppTheme } from "@/utils/useAppTheme"
import { observer } from "mobx-react-lite"
import { FC, useCallback, useEffect } from "react"
import { ReadyState } from "react-use-websocket"
import { Button, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import { $header, $screenContentContainer, $subHeader, $tapButton } from "./styles"

interface WaitListScreenProps extends AppStackScreenProps<"WaitList"> {}

export const WaitListScreen: FC<WaitListScreenProps> = observer(function WaitListScreen(_props) {
  const pendingState = [ReadyState.CONNECTING, ReadyState.CLOSING]
  const { toggleConnection, disconnect, isConnected, readyState } = useMatchSubscription()
  const { themed } = useAppTheme()
  const {
    authenticationStore: { name, logout },
  } = useStores()
  const { error } = useMe()
  const buttonText = isConnected ? ActionState.DISCONNECT : ActionState.CONNECT

  const handleDisconnect = useCallback(() => {
    disconnect()
    logout()
  }, [disconnect, logout])

  useEffect(() => {
    if (error) {
      handleDisconnect()
    }
  }, [error, handleDisconnect])

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text text={`Hello, ${name}!`} preset="heading" style={themed($header)} />
      <Text
        text="Jump into matchmaking and let the conversation flow!"
        preset="subheading"
        style={themed($subHeader)}
      />
      <Button
        text={buttonText}
        style={themed($tapButton)}
        preset="reversed"
        onPress={toggleConnection}
        disabled={pendingState.includes(readyState)}
      />
      <Button
        text={"Leave"}
        style={themed($tapButton)}
        preset="default"
        onPress={handleDisconnect}
      />
    </Screen>
  )
})
