import React from "react";
import { View, Text, StyleProp, TextStyle, ViewStyle } from "react-native";
import { radius } from "./theme";

type BadgeProps = {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Badge({
  label,
  backgroundColor = "#EEE",
  textColor = "#333",
  style,
  textStyle,
}: BadgeProps) {
  return (
    <View
      style={[
        {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: radius.full,
          backgroundColor,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 12,
            fontWeight: "500",
            color: textColor,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
