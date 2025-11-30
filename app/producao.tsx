import React from "react";
import { View, Text } from "react-native";

import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { colors } from "../components/theme";
import {
  useAppData,
  StatusProducao,
  AreaPreparo,
  ComandaItem,
} from "../contexts/AppDataContext";

interface ProducaoViewItem {
  comandaId: string;
  item: ComandaItem;
  mesa: string;
  hora: string;
  titulo: string;
  area: AreaPreparo;
}

const ProducaoPage: React.FC = () => {
  const { comandas, menuItems, atualizarStatusItem } = useAppData();

  const pedidos: ProducaoViewItem[] = [];

  comandas
    .filter((c) => c.status === "Aberta")
    .forEach((c) => {
      c.itens.forEach((it) => {
        const menu = menuItems.find((m) => m.id === it.menuItemId);
        if (!menu) return;

        pedidos.push({
          comandaId: c.id,
          item: it,
          mesa: c.mesa,
          hora: c.horaAbertura,
          titulo: `${it.quantidade}x ${menu.nome}`,
          area: it.areaPreparo,
        });
      });
    });

  const cozinhaPend = pedidos.filter(
    (p) => p.area === "Cozinha" && p.item.status !== "Pronto"
  );
  const cozinhaProntos = pedidos.filter(
    (p) => p.area === "Cozinha" && p.item.status === "Pronto"
  );
  const copaPend = pedidos.filter(
    (p) => p.area === "Copa" && p.item.status !== "Pronto"
  );
  const copaProntos = pedidos.filter(
    (p) => p.area === "Copa" && p.item.status === "Pronto"
  );

  const badgeStatus = (status: StatusProducao) => {
    if (status === "Pendente") {
      return (
        <Badge
          label="Pendente"
          backgroundColor="rgba(255, 215, 80, 0.25)"
          textColor="#C27700"
        />
      );
    }
    if (status === "Em Preparo") {
      return (
        <Badge
          label="Em Preparo"
          backgroundColor="rgba(80, 170, 255, 0.25)"
          textColor="#2467C9"
        />
      );
    }
    return (
      <Badge
        label="Pronto"
        backgroundColor="rgba(50, 200, 100, 0.18)"
        textColor="#148441"
      />
    );
  };

  const renderCard = (p: ProducaoViewItem) => (
    <Card
      key={p.item.id}
      style={{
        marginBottom: 16,
        width: "100%",
        maxWidth: 650,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text style={{ fontWeight: "600", color: colors.textPrimary }}>
          Mesa {p.mesa}
        </Text>
        {badgeStatus(p.item.status)}
      </View>

      <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 10 }}>
        ⏱ {p.hora}
      </Text>

      <View
        style={{
          backgroundColor: "#F7F7F8",
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: colors.textPrimary }}>{p.titulo}</Text>
      </View>

      {p.item.status === "Pendente" && (
        <Button
          label="Iniciar Preparo"
          variant="dark"
          onPress={() =>
            atualizarStatusItem(p.comandaId, p.item.id, "Em Preparo")
          }
        />
      )}

      {p.item.status === "Em Preparo" && (
        <Button
          label="Marcar como Pronto"
          variant="dark"
          onPress={() =>
            atualizarStatusItem(p.comandaId, p.item.id, "Pronto")
          }
        />
      )}
    </Card>
  );

  return (
    <PageContainer>

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 4 }}>
          Ordens de Produção
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 24 }}>
          Gerencie os pedidos da cozinha e copa
        </Text>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontWeight: "600", color: "#C4641A", marginBottom: 12 }}>
            🍳 Cozinha ({cozinhaPend.length})
          </Text>

          {cozinhaPend.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>
              Nenhum pedido para cozinha no momento
            </Text>
          ) : (
            cozinhaPend.map(renderCard)
          )}

          {cozinhaProntos.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: 12,
                }}
              >
                Prontos ({cozinhaProntos.length})
              </Text>
              {cozinhaProntos.map((p) => (
                <Card key={p.item.id} style={{ marginBottom: 12, width: 650 }}>
                  <Text
                    style={{ fontWeight: "600", color: colors.textPrimary }}
                  >
                    Mesa {p.mesa}
                  </Text>
                  <View style={{ marginTop: 8 }}>{badgeStatus("Pronto")}</View>
                </Card>
              ))}
            </View>
          )}
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontWeight: "600", color: "#C4641A", marginBottom: 12 }}>
            🥤 Copa ({copaPend.length})
          </Text>

          {copaPend.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>
              Nenhum pedido para copa no momento
            </Text>
          ) : (
            copaPend.map(renderCard)
          )}

          {copaProntos.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: 12,
                }}
              >
                Prontos ({copaProntos.length})
              </Text>
              {copaProntos.map((p) => (
                <Card key={p.item.id} style={{ marginBottom: 12, width: 650 }}>
                  <Text
                    style={{ fontWeight: "600", color: colors.textPrimary }}
                  >
                    Mesa {p.mesa}
                  </Text>
                  <View style={{ marginTop: 8 }}>{badgeStatus("Pronto")}</View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </View>
    </PageContainer>
  );
};

export default ProducaoPage;
