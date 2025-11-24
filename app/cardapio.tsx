import React, { useState } from "react";
import { View, Text } from "react-native";

import PageContainer from "../components/PageContainer";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Badge from "../components/Badge";
import Select, { SelectOption } from "../components/Select";
import { colors } from "../components/theme";
import {
  useAppData,
  Categoria,
  AreaPreparo,
  MenuItem,
} from "../contexts/AppDataContext";

const categoriaOptions: SelectOption[] = [
  { label: "Entrada", value: "Entrada" },
  { label: "Prato Principal", value: "Prato Principal" },
  { label: "Sobremesa", value: "Sobremesa" },
  { label: "Bebida", value: "Bebida" },
];

const areaOptions: SelectOption[] = [
  { label: "Copa", value: "Copa" },
  { label: "Cozinha", value: "Cozinha" },
];

const CardapioPage: React.FC = () => {
  const { menuItems, addMenuItem, deleteMenuItem } = useAppData();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("Entrada");
  const [areaPreparo, setAreaPreparo] = useState<AreaPreparo>("Cozinha");

  const limpar = () => {
    setNome("");
    setDescricao("");
    setPreco("");
    setCategoria("Entrada");
    setAreaPreparo("Cozinha");
  };

  const handleAdd = () => {
    if (!nome || !preco) return;

    addMenuItem({
      nome,
      descricao,
      preco: parseFloat(preco.replace(",", ".")),
      categoria,
      areaPreparo,
    });

    limpar();
    setModalVisivel(false);
  };

  const renderCategoriaSection = (cat: Categoria, titulo: string) => {
    const filtrados = menuItems.filter((item) => item.categoria === cat);
    if (filtrados.length === 0) return null;

    return (
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontWeight: "500",
            marginBottom: 8,
            color: colors.textPrimary,
          }}
        >
          {titulo}
        </Text>

        {filtrados.map((item) => (
          <MenuCard key={item.id} item={item} onDelete={deleteMenuItem} />
        ))}
      </View>
    );
  };

  return (
    <PageContainer>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 24,
        }}
      >
        <View>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 4 }}>
            Cardápio
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            Gerencie os itens do cardápio
          </Text>
        </View>

        <Button
          label="+ Novo Item"
          variant="dark"
          onPress={() => setModalVisivel(true)}
        />
      </View>

      <View>
        {renderCategoriaSection("Entrada", "Entrada")}
        {renderCategoriaSection("Prato Principal", "Prato Principal")}
        {renderCategoriaSection("Sobremesa", "Sobremesa")}
        {renderCategoriaSection("Bebida", "Bebida")}
      </View>

      {modalVisivel && (
        <Modal
          title="Novo Item do Cardápio"
          onClose={() => {
            setModalVisivel(false);
            limpar();
          }}
        >
          <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
            Preencha as informações do item do cardápio
          </Text>

          <Input
            label="Nome do Item"
            placeholder="Ex: Salada Caesar"
            value={nome}
            onChangeText={setNome}
          />

          <Input
            label="Descrição"
            placeholder="Descrição do prato"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          <Input
            label="Preço (R$)"
            placeholder="Ex: 28,90"
            keyboardType="numeric"
            value={preco}
            onChangeText={setPreco}
          />

          <Select
            label="Categoria"
            value={categoria}
            onChange={(val) => setCategoria(val as Categoria)}
            options={categoriaOptions}
          />

          <Select
            label="Área de Preparo"
            value={areaPreparo}
            onChange={(val) => setAreaPreparo(val as AreaPreparo)}
            options={areaOptions}
          />

          <View style={{ marginTop: 20, alignItems: "flex-end" }}>
            <Button label="Adicionar Item" variant="dark" onPress={handleAdd} />
          </View>
        </Modal>
      )}
    </PageContainer>
  );
};

const MenuCard: React.FC<{
  item: MenuItem;
  onDelete: (id: string) => void;
}> = ({ item, onDelete }) => {
  return (
    <Card style={{ marginBottom: 12, width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text
            style={{
              fontWeight: "600",
              color: colors.textPrimary,
              marginBottom: 4,
            }}
          >
            {item.nome}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            {item.descricao}
          </Text>
        </View>

        <View
          style={{
            width: 60,
            alignItems: "flex-end",
            justifyContent: "flex-start",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 16 }}>✏️</Text>
          <Text
            style={{ fontSize: 16, color: "#FF4D4D" }}
            onPress={() => onDelete(item.id)}
          >
            🗑
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 12,
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Badge
            label={item.categoria}
            backgroundColor="rgba(255, 159, 67, 0.22)"
            textColor="#E67E22"
          />
        <Badge
            label={item.areaPreparo}
            backgroundColor="rgba(0,0,0,0.06)"
            textColor={colors.textPrimary}
          />
        </View>

        <Text
          style={{
            fontWeight: "600",
            color: "#16A34A",
            fontSize: 14,
          }}
        >
          R$ {item.preco.toFixed(2).replace(".", ",")}
        </Text>
      </View>
    </Card>
  );
};

export default CardapioPage;
