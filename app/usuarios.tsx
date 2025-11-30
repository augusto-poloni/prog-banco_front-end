import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";

import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Select, { SelectOption } from "../components/Select";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { colors } from "../components/theme";

type Funcao = "Gerente" | "Garçom";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  funcao: Funcao;
  ativo: boolean;
}

const FUNCOES: SelectOption[] = [
  { label: "Gerente", value: "Gerente" },
  { label: "Garçom", value: "Garçom" },
];

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      nome: "João Silva",
      email: "joao@restaurante.com",
      funcao: "Gerente",
      ativo: true,
    },
    {
      id: "2",
      nome: "Maria Santos",
      email: "maria@restaurante.com",
      funcao: "Garçom",
      ativo: true,
    },
  ]);

  const [modalNovo, setModalNovo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(
    null
  );

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [funcao, setFuncao] = useState<Funcao>("Garçom");
  const [ativo, setAtivo] = useState(true);

  const resetForm = () => {
    setNome("");
    setEmail("");
    setFuncao("Garçom");
    setAtivo(true);
    setUsuarioSelecionado(null);
  };

  const abrirNovo = () => {
    resetForm();
    setModalNovo(true);
  };

  const adicionarUsuario = () => {
    if (!nome || !email) return;

    const novo: Usuario = {
      id: Date.now().toString(),
      nome,
      email,
      funcao,
      ativo,
    };

    setUsuarios((prev) => [...prev, novo]);
    setModalNovo(false);
    resetForm();
  };

  const abrirEditar = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setNome(usuario.nome);
    setEmail(usuario.email);
    setFuncao(usuario.funcao);
    setAtivo(usuario.ativo);
    setModalEditar(true);
  };

  const salvarEdicao = () => {
    if (!usuarioSelecionado) return;

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioSelecionado.id
          ? { ...u, nome, email, funcao, ativo }
          : u
      )
    );

    setModalEditar(false);
    resetForm();
  };

  const removerUsuario = (id: string) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const renderBadgeFuncao = (funcao: Funcao) => {
    if (funcao === "Gerente") {
      return (
        <Badge
          label="Gerente"
          backgroundColor="rgba(194, 128, 255, 0.35)"
          textColor="#6B21A8"
        />
      );
    }
    return (
      <Badge
        label="Garçom"
        backgroundColor="rgba(59, 130, 246, 0.22)"
        textColor="#1D4ED8"
      />
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title=""
        subtitle=""
        actionLabel="+ Novo Usuário"
        onAction={abrirNovo}
      />

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 4 }}>
          Usuários
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
          Gerencie os usuários do sistema
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {usuarios.map((user) => (
            <Card key={user.id} style={{ width: "100%", maxWidth: 340 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: colors.textPrimary,
                      marginBottom: 2,
                    }}
                  >
                    {user.nome}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                    {user.email}
                  </Text>
                </View>

                {user.ativo && (
                  <View
                    style={{
                      backgroundColor: "#050515",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 20,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: "600",
                      }}
                    >
                      Ativo
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ marginTop: 10 }}>{renderBadgeFuncao(user.funcao)}</View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => abrirEditar(user)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: "#E5E5EE",
                  }}
                >
                  <Text>✏️</Text>
                  <Text style={{ fontWeight: "500" }}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => removerUsuario(user.id)}>
                  <Text style={{ fontSize: 18, color: "#EF4444" }}>🗑</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {modalNovo && (
        <Modal title="Novo Usuário" onClose={() => setModalNovo(false)}>
          <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
            Preencha as informações do usuário
          </Text>

          <Input
            label="Nome Completo"
            placeholder="Ex: João Silva"
            value={nome}
            onChangeText={setNome}
          />

          <Input
            label="E-mail"
            placeholder="email@restaurante.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Select
            label="Função"
            value={funcao}
            onChange={(val) => setFuncao(val as Funcao)}
            options={FUNCOES}
          />

          <View
            style={{
              marginTop: 12,
              marginBottom: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
              Usuário Ativo
            </Text>
            <Switch
              value={ativo}
              onValueChange={setAtivo}
              trackColor={{ false: "#E5E5EA", true: "#4ADE80" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={{ marginTop: 16, alignItems: "flex-end" }}>
            <Button
              label="Adicionar Usuário"
              variant="dark"
              onPress={adicionarUsuario}
            />
          </View>
        </Modal>
      )}

      {modalEditar && (
        <Modal title="Editar Usuário" onClose={() => setModalEditar(false)}>
          <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
            Preencha as informações do usuário
          </Text>

          <Input
            label="Nome Completo"
            value={nome}
            onChangeText={setNome}
          />

          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Select
            label="Função"
            value={funcao}
            onChange={(val) => setFuncao(val as Funcao)}
            options={FUNCOES}
          />

          <View
            style={{
              marginTop: 12,
              marginBottom: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
              Usuário Ativo
            </Text>
            <Switch
              value={ativo}
              onValueChange={setAtivo}
              trackColor={{ false: "#E5E5EA", true: "#4ADE80" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={{ marginTop: 16, alignItems: "flex-end" }}>
            <Button
              label="Salvar Alterações"
              variant="dark"
              onPress={salvarEdicao}
            />
          </View>
        </Modal>
      )}
    </PageContainer>
  );
};

export default UsuariosPage;
