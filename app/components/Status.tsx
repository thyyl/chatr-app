import { colors, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { StyleProp, View, ViewStyle } from "react-native"

export interface StatusProps {
  /**
   * Whether the user is online or offline.
   */
  status: "online" | "offline"

  /**
   * Optional size for the status indicator dot.
   */
  dotSize?: number

  /**
   * Style for the container wrapping the Text and the dot.
   */
  containerStyle?: StyleProp<ViewStyle>
}

export function Status(props: StatusProps) {
  const { status, dotSize = 10, containerStyle } = props
  const { themed } = useAppTheme()

  const offsetSize = dotSize + 1.5

  const $contentContainerStyles: StyleProp<ViewStyle> = [
    themed($contentContainer),
    containerStyle,
    {
      width: offsetSize,
      height: offsetSize,
      backgroundColor: status === "online" ? colors.success : colors.border,
    },
  ]

  return <View style={$contentContainerStyles} />
}

const $contentContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  bottom: 0,
  right: 0,
  borderWidth: 1.5,
  borderColor: colors.palette.neutral100,
  borderRadius: 50,
})
