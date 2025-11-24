import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
} from "react-native";
import { colors, radius } from "./theme";

type InputProps = TextInputProps & {
  label?: string;
};

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
  keyboardType,
  ...rest
}: InputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label && (
        <Text
          style={{
            color: colors.textPrimary,
            marginBottom: 4,
            fontWeight: "500",
          }}
        >
          {label}
        </Text>
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A5A5AF"
        multiline={multiline}
        keyboardType={keyboardType}
        style={{
          backgroundColor: colors.inputBackground,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          paddingHorizontal: 12,
          paddingVertical: 10,
          minHeight: multiline ? 90 : 44,
        }}
        {...rest}
      />
    </View>
  );
}
