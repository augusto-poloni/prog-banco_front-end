import React, { useState } from "react";
import { View, Text } from "react-native";

import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Select, { SelectOption } from "../components/Select";
import Badge from "../components/Badge";
import { colors } from "../components/theme";
import { useAppData, Comanda } from "../contexts/AppDataContext";

const ComandasPage: React.FC = () => {
  const {
    comandas,
    menuItems,
    abrirComanda,
    adicionarItemNaComanda,
    fecharComanda,
  } = useAppData();

  const [novaComandaVisivel, setNovaComandaVisivel] = useState(false);
  const [mesa, setMesa] = useState("");

  const [modalItemVisivel, setModalItemVisivel] = useState(false);
  const [comandaSelecionada, setComandaSelecionada] = useState<Comanda | null>(
    null
  );
  const [itemSelecionado, setItemSelecionado] = useState<string>("");
  const [quantidade, setQuantidade] = useState<string>("1");

  const optionsItens: SelectOption[] = menuItems.map((m) => ({
    label: `${m.nome} (${m.areaPreparo})`,
    value: m.id,
  }));

  function handleAbrirComanda() {
    if (!mesa) return;
    abrirComanda(mesa);
    setMesa("");
    setNovaComandaVisivel(false);
  }

  function abrirModalItem(comanda: Comanda) {
    setComandaSelecionada(comanda);
    setItemSelecionado(menuItems[0]?.id ?? "");
    setQuantidade("1");
    setModalItemVisivel(true);
  }

  function handleAdicionarItem() {
    if (!comandaSelecionada || !itemSelecionado || !quantidade) return;

    adicionarItemNaComanda(
      comandaSelecionada.id,
      itemSelecionado,
      Number(quantidade)
    );

    setModalItemVisivel(false);
  }

  const comandasAbertas = comandas.filter((c) => c.status === "Aberta");

  return (
    <PageContainer>
      <PageHeader
        title=""
        subtitle=""
        actionLabel="+ Nova Comanda"
        onAction={() => setNovaComandaVisivel(true)}
      />

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 4 }}>
          Comandas
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
          Gerencie as comandas do restaurante
        </Text>

        <Text style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: "600" }}>Comandas Abertas</Text>{" "}
          <Text>({comandasAbertas.length})</Text>
        </Text>

        {comandasAbertas.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 80, 
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: colors.textSecondary,textAlign: 'center', fontSize: 16 }}>
              Nenhuma comanda aberta no momento{"\n"}
              Clique em "+ Nova Comanda" para começar.
            </Text>
          </View>
        ) : (
          comandasAbertas.map((c) => (
            <Card key={c.id} style={{ width: 420, marginTop: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <View>
                  <Text
                    style={{ fontWeight: "600", color: colors.textPrimary }}
                  >
                    Mesa {c.mesa}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      marginTop: 4,
                      fontSize: 12,
                    }}
                  >
                    Aberta às {c.horaAbertura}
                  </Text>
                </View>

                <Badge
                  label="Aberta"
                  backgroundColor="rgba(46, 204, 113, 0.16)"
                  textColor={colors.success}
                />
              </View>

              <View style={{ marginVertical: 12 }}>
                {c.itens.length === 0 ? (
                  <Text
                    style={{
                      color: colors.textSecondary,
                      textAlign: "center",
                      paddingVertical: 16,
                    }}
                  >
                    Nenhum item adicionado
                  </Text>
                ) : (
                  c.itens.map((it) => {
                    const menu = menuItems.find((m) => m.id === it.menuItemId);
                    if (!menu) return null;
                    return (
                      <View
                        key={it.id}
                        style={{
                          paddingVertical: 4,
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text>
                          {it.quantidade}x {menu.nome}
                        </Text>
                        <Text style={{ color: colors.textSecondary }}>
                          {menu.areaPreparo}
                        </Text>
                      </View>
                    );
                  })
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Button
                    label="Adicionar Item"
                    variant="primary"
                    onPress={() => abrirModalItem(c)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label="Fechar Comanda"
                    variant="dark"
                    onPress={() => fecharComanda(c.id)}
                  />
                </View>
              </View>
            </Card>
          ))
        )}
      </View>

      {novaComandaVisivel && (
        <Modal
          title="Nova Comanda"
          onClose={() => setNovaComandaVisivel(false)}
        >
          <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
            Informe o número da mesa para abrir uma nova comanda
          </Text>

          <Input
            label="Número da Mesa"
            placeholder="Ex: 5"
            keyboardType="numeric"
            value={mesa}
            onChangeText={setMesa}
          />

          <View style={{ marginTop: 16, alignItems: "flex-end" }}>
            <Button
              label="Abrir Comanda"
              variant="dark"
              onPress={handleAbrirComanda}
            />
          </View>
        </Modal>
      )}

      {modalItemVisivel && comandaSelecionada && (
        <Modal
          title={`Adicionar Item - Mesa ${comandaSelecionada.mesa}`}
          onClose={() => setModalItemVisivel(false)}
        >
          <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
            Selecione o item do cardápio e a quantidade
          </Text>

          <Select
            label="Item"
            value={itemSelecionado || optionsItens[0]?.value || ""}
            onChange={(val) => setItemSelecionado(val)}
            options={optionsItens}
          />

          <Input
            label="Quantidade"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />

          <View style={{ marginTop: 16, alignItems: "flex-end" }}>
            <Button
              label="Adicionar"
              variant="dark"
              onPress={handleAdicionarItem}
            />
          </View>
        </Modal>
      )}
    </PageContainer>
  );
};

export default ComandasPage;
