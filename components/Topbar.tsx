import { View, Text } from "react-native";
import { colors } from "./theme";

export default function Topbar() {
  return (
    <View
      style={{
        height: 56,
        backgroundColor: "#1F1F1F",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        Restaurante App
      </Text>
    </View>
  );
}
