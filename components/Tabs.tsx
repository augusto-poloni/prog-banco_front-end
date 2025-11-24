import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { usePathname, useRouter, Href } from "expo-router";
import { colors, radius } from "./theme";

type TabItem = {
  label: string;
  path: Href;
};

const tabs: TabItem[] = [
  { label: "Comandas", path: "/" },
  { label: "Cardápio", path: "/cardapio" },
  { label: "Produção", path: "/producao" },
  { label: "Vendas", path: "/vendas" },
  { label: "Usuários", path: "/usuarios" },
];

const Tabs: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 800,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: colors.tabBackground,
        borderRadius: radius.full,
        padding: 4,
      }}
    >
      {tabs.map((tab) => {
        const active =
          tab.path === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.path as string);

        return (
          <TouchableOpacity
            key={tab.label}
            onPress={() => router.push(tab.path)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: radius.full,
              backgroundColor: active ? "#FFFFFF" : "transparent",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: active ? "600" : "500",
                color: active ? colors.textPrimary : colors.tabInactiveText,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Tabs;
