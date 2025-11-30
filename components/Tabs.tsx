import React from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
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
    <View style={{ height: 50, marginBottom: 10 }}>
      <ScrollView
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 0, 
          height: 45 
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.tabBackground,
            borderRadius: radius.full,
            padding: 4,
            alignSelf: 'center', 
            minWidth: '100%' 
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
                  paddingVertical: 8,
                  paddingHorizontal: 20, 
                  borderRadius: radius.full,
                  backgroundColor: active ? "#FFFFFF" : "transparent",
                  marginRight: 2, 
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: active ? "700" : "500",
                    color: active ? colors.textPrimary : colors.tabInactiveText,
                    fontSize: 14,
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Tabs;