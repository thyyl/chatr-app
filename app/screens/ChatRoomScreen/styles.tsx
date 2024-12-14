import { ThemedStyle } from "@/theme"
import { ViewStyle } from "react-native"

export const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

export const $contentContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})
