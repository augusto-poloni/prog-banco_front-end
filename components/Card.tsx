import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { colors, radius, shadow } from "./theme";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Card({ children, style }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.cardBackground,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          padding: 16,
          ...shadow.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
