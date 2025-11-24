import React from "react";
import { View, Text } from "react-native";
import Button from "./Button";
import { colors } from "./theme";

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const PageHeader: React.FC<Props> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <View
      style={{
        width: "100%",
        marginTop: 20,
        marginBottom: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#D35400",
            marginBottom: 4,
          }}
        >
          {title}
        </Text>

        {subtitle && (
          <Text style={{ color: colors.textSecondary }}>{subtitle}</Text>
        )}
      </View>

      {actionLabel && (
        <Button label={actionLabel} variant="dark" onPress={onAction} />
      )}
    </View>
  );
};

export default PageHeader;
