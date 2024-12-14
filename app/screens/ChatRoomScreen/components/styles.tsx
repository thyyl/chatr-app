import { ThemedStyle } from "@/theme"
import { ViewStyle } from "react-native"

export const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

export const $chatInputContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.background,
})

export const $chatMessageContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderTopWidth: 1,
  borderColor: colors.palette.neutral200,
  borderTopColor: colors.palette.neutral200,
  borderRadius: 30,
  paddingRight: spacing.xxs,
})

export const $sendButtonContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  justifyContent: "center",
})

export const $sendButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderRadius: 500,
  backgroundColor: colors.palette.primary100,
  width: 30,
  height: 30,
  alignItems: "center",
  justifyContent: "center",
})

export const $headerContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  paddingTop: spacing.xxxl,
  paddingBottom: spacing.xs,
  paddingHorizontal: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral300,
})

export const $headerLoadingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})

export const $paddedContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.xs,
})

export const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  rowGap: spacing.xs,
})

export const $avatarContainer: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
})
