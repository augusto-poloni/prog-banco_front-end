import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { colors } from "../components/theme";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAppData } from "../contexts/AppDataContext";

interface RegisterProps {
  onGoToLogin?: () => void;
}

export default function CadastroPage({ onGoToLogin }: RegisterProps) {
  const { signUp } = useAppData();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!nome || !email || !senha) return Alert.alert("Erro", "Preencha todos os campos");

    setLoading(true);
    try {
      await signUp(nome, email, senha);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <View style={{ width: "100%", maxWidth: 400 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.accent, textAlign: "center", marginBottom: 8 }}>
          Criar Conta
        </Text>
        <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center", marginBottom: 32 }}>
          Cadastre-se para gerenciar o restaurante
        </Text>

        <Input 
          label="Nome Completo" 
          placeholder="Ex: João Silva" 
          value={nome} 
          onChangeText={setNome} 
        />

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
            label={loading ? "Criando conta..." : "Cadastrar"} 
            variant="dark" 
            onPress={handleRegister} 
          />
          
          {onGoToLogin && (
            <Button 
              label="Já tem conta? Faça Login" 
              variant="ghost" 
              onPress={onGoToLogin} 
            />
          )}
        </View>
      </View>
    </View>
  );
}