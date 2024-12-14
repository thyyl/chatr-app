import { useLocalLogin } from "@/services/hooks"
import { useAppTheme } from "@/utils/useAppTheme"
import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View } from "react-native"
import { Button, Divider, Icon, Screen, Text, TextField } from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import {
  $dividerContainer,
  $enterDetails,
  $logIn,
  $screenContentContainer,
  $tapButton,
  $textField,
} from "./styles"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { themed } = useAppTheme()
  const {
    authenticationStore: { name, setName, login: authStoreLogin },
  } = useStores()

  const { mutateAsync: localLogin, isPending: isLocalLoginPending } = useLocalLogin({
    onSuccess: (data) => authStoreLogin(data),
  })

  const login = () => {
    if (name.trim().length <= 0) {
      return
    }

    localLogin({ name })
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text text="Chatr" preset="heading" style={themed($logIn)} />
      <Text text="Let's get you into Chatr" preset="subheading" style={themed($enterDetails)} />
      <TextField
        value={name}
        onChangeText={setName}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="given-name"
        autoCorrect={false}
        keyboardType="name-phone-pad"
        label="Name"
        placeholder="e.g. Elon Musk"
      />
      <Button
        text="Sign in"
        style={themed($tapButton)}
        preset="reversed"
        onPress={login}
        disabled={isLocalLoginPending}
      />
      <View style={themed($dividerContainer)}>
        <Divider />
      </View>
      <Button
        text="Sign in with Google"
        style={themed($tapButton)}
        preset="reversed"
        onPress={login}
        disabled={isLocalLoginPending}
        LeftAccessory={() => <Icon icon="google" size={20} />}
      />
    </Screen>
  )
})
