import React from "react";
import { View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import Topbar from "../components/Topbar";
import Tabs from "../components/Tabs";
import PageHeader from "../components/PageHeader";
import { colors } from "../components/theme";
import { AppDataProvider } from "../contexts/AppDataContext";

export default function RootLayout() {
  return (
    <AppDataProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        
        <Topbar />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 80,
            paddingTop: 40,
            paddingBottom: 120,
          }}
        >
          <PageHeader
            title="Sistema de Gerenciamento"
            subtitle="Gerencie seu restaurante de forma eficiente"
          />

          <View style={{ marginTop: 20, marginBottom: 32 }}>
            <Tabs />
          </View>

          <Stack screenOptions={{ headerShown: false }} />
        </ScrollView>

      </View>
    </AppDataProvider>
  );
}
