import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors, radius, shadow } from "./theme";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ title, children, onClose }: ModalProps) {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <View
        style={{
          width: "60%",
          maxWidth: 700,
          backgroundColor: colors.cardBackground,
          borderRadius: radius.lg,
          padding: 24,
          ...shadow.card,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.textPrimary,
            }}
          >
            {title}
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 18, color: colors.textSecondary }}>✕</Text>
          </TouchableOpacity>
        </View>

        {children}
      </View>
    </View>
  );
}
