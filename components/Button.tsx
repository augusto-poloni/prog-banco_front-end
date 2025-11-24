import React from "react";
import { TouchableOpacity, Text, GestureResponderEvent } from "react-native";
import { colors, radius, shadow } from "./theme";

type ButtonVariant = "primary" | "dark" | "ghost";

type ButtonProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
};

const stylesByVariant: Record<
  ButtonVariant,
  { backgroundColor: string; textColor: string }
> = {
  primary: {
    backgroundColor: colors.accent,
    textColor: "#FFFFFF",
  },
  dark: {
    backgroundColor: colors.buttonDark,
    textColor: "#FFFFFF",
  },
  ghost: {
    backgroundColor: "transparent",
    textColor: colors.textPrimary,
  },
};

export default function Button({
  label,
  onPress,
  variant = "primary",
}: ButtonProps) {
  const { backgroundColor, textColor } = stylesByVariant[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: radius.full,
        backgroundColor,
        minWidth: 140,
        alignItems: "center",
        justifyContent: "center",
        ...(variant !== "ghost" ? shadow.card : {}),
      }}
    >
      <Text
        style={{
          color: textColor,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
