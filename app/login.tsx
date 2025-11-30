import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { colors } from "../components/theme";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAppData } from "../contexts/AppDataContext";


interface LoginProps {
  onGoToRegister?: () => void;
}

export default function LoginPage({ onGoToRegister }: LoginProps) {
  const { signIn } = useAppData();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha) return Alert.alert("Erro", "Preencha todos os campos");
    
    setLoading(true);
    try {
      await signIn(email, senha);
    } catch (error) {
      Alert.alert("Erro de Login", "Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <View style={{ width: "100%", maxWidth: 400 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.accent, textAlign: "center", marginBottom: 8 }}>
          Sal Monelas
        </Text>
        <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center", marginBottom: 32 }}>
          Acesse sua conta para continuar
        </Text>

        <Input 
          label="E-mail" 
          placeholder="seu@email.com" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input 
          label="Senha" 
          placeholder="******" 
          value={senha} 
          onChangeText={setSenha} 
          secureTextEntry 
        />

        <View style={{ marginTop: 24, gap: 12 }}>
          <Button 
            label={loading ? "Entrando..." : "Entrar"} 
            variant="dark" 
            onPress={handleLogin} 
          />
          
          {onGoToRegister && (
            <Button 
              label="Não tem conta? Cadastre-se" 
              variant="ghost" 
              onPress={onGoToRegister} 
            />
          )}
        </View>
      </View>
    </View>
  );
}