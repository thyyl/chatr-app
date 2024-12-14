import { $styles, ThemedStyle, ThemedStyleArray } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "./Text"

export interface DividerProps {
  /**
   * An optional style override for the container.
   */
  style?: ViewStyle
  /**
   * An optional style override for the text.
   */
  textStyle?: TextStyle
  /**
   * Custom text to replace the default "OR" text.
   */
  text?: string
}

export function Divider(props: DividerProps) {
  const { style: $styleOverride, textStyle: $textStyleOverride, text = "OR" } = props

  const { themed } = useAppTheme()

  return (
    <View style={[themed($containerStyle), $styleOverride]}>
      <View style={themed($dividerStyle)} />
      <Text style={[themed($textStyle), $textStyleOverride]}>{text}</Text>
      <View style={themed($dividerStyle)} />
    </View>
  )
}

const $containerStyle: ThemedStyleArray<ViewStyle> = [
  $styles.row,
  ({ spacing }) => ({
    marginVertical: spacing.md,
    alignItems: "center",
  }),
]

const $dividerStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  height: 1,
  backgroundColor: colors.palette.neutral400,
})

const $textStyle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  paddingHorizontal: 10,
  color: colors.palette.neutral500,
  fontFamily: typography.primary.medium,
  fontSize: 14,
  textTransform: "uppercase",
})
