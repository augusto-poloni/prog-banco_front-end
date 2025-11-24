import React from "react";
import { View } from "react-native";

interface Props {
  children: React.ReactNode;
}

const PageContainer: React.FC<Props> = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        maxWidth: 1100,
        alignSelf: "flex-start",
      }}
    >
      {children}
    </View>
  );
};

export default PageContainer;
