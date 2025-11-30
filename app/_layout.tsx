import React, { useState } from "react";
import { View, Platform } from "react-native";
import { Stack } from "expo-router";
import Topbar from "../components/Topbar";
import Tabs from "../components/Tabs";
import { colors } from "../components/theme";
import { AppDataProvider, useAppData } from "../contexts/AppDataContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginPage from "./login";
import CadastroPage from "./cadastro";


function MainLayout() {
  const { user } = useAppData();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const paddingLateral = Platform.OS === 'web' ? 80 : 20;


  if (!user) {

    if (isRegistering) {
      return <CadastroPage onGoToLogin={() => setIsRegistering(false)} />;
    }
    return <LoginPage onGoToRegister={() => setIsRegistering(true)} />;
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Topbar />
      <View style={{ flex: 1, paddingHorizontal: paddingLateral }}>
        <View style={{ marginTop: 20 }}>
           <Tabs />
        </View>
        <View style={{ flex: 1, marginTop: 10 }}> 
           <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
        </View>
      </View>
    </SafeAreaView>
  );
}


export default function RootLayout() {
  return (
    <AppDataProvider>
      <MainLayout />
    </AppDataProvider>
  );
}