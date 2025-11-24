import React from "react";
import { View, Text } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";

import PageContainer from "../components/PageContainer";
import Card from "../components/Card";
import { colors } from "../components/theme";
import { useAppData, Categoria } from "../contexts/AppDataContext";

const colorByCategoria: Record<Categoria, string> = {
  "Prato Principal": "#2ecc71",
  Entrada: "#e67e22",
  Sobremesa: "#e84393",
  Bebida: "#3498db",
};

const VendasPage: React.FC = () => {
  const { comandas, menuItems } = useAppData();

  const fechadas = comandas.filter((c) => c.status === "Fechada");

  let totalVendas = 0;
  let itensVendidos = 0;

  const vendasPorHora: Record<string, number> = {};
  const vendasPorCategoria: Record<string, number> = {};
  const itensMap: Record<
    string,
    { nome: string; unidades: number; valor: number }
  > = {};

  fechadas.forEach((c) => {
    const horaLabel = (c.horaAbertura ?? "00:00").slice(0, 2) + "h";

    c.itens.forEach((it) => {
      const menu = menuItems.find((m) => m.id === it.menuItemId);
      if (!menu) return;

      const valor = menu.preco * it.quantidade;
      totalVendas += valor;
      itensVendidos += it.quantidade;

      vendasPorHora[horaLabel] =
        (vendasPorHora[horaLabel] || 0) + valor;

      vendasPorCategoria[menu.categoria] =
        (vendasPorCategoria[menu.categoria] || 0) + valor;

      if (!itensMap[menu.id]) {
        itensMap[menu.id] = {
          nome: menu.nome,
          unidades: 0,
          valor: 0,
        };
      }
      itensMap[menu.id].unidades += it.quantidade;
      itensMap[menu.id].valor += valor;
    });
  });

  const pedidos = fechadas.length;
  const ticketMedio = pedidos > 0 ? totalVendas / pedidos : 0;

  const horaLabels = Object.keys(vendasPorHora).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  const barData = {
    labels: horaLabels.length ? horaLabels : ["-"],
    datasets: [
      {
        data: horaLabels.length
          ? horaLabels.map((h) => vendasPorHora[h])
          : [0],
      },
    ],
  };

  const pieDataRaw = Object.entries(vendasPorCategoria).map(
    ([categoria, valor]) => ({
      name: categoria,
      population: valor,
      color: colorByCategoria[categoria as Categoria] ?? "#CCCCCC",
      legendFontColor: "#444",
      legendFontSize: 14,
    })
  );

  const pieData =
    pieDataRaw.length > 0
      ? pieDataRaw
      : [
          {
            name: "Sem vendas",
            population: 1,
            color: "#E5E7EB",
            legendFontColor: "#444",
            legendFontSize: 14,
          },
        ];

  const itensMaisVendidos = Object.values(itensMap)
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);

  return (
    <PageContainer>
      <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 24 }}>
        Relatório de Vendas
      </Text>
      <Text style={{ color: colors.textSecondary, marginBottom: 24 }}>
        Vendas do dia (comandas fechadas)
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card style={{ width: 250 }}>
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Total de Vendas
          </Text>
          <Text
            style={{
              fontSize: 22,
              color: "#16a34a",
              fontWeight: "bold",
            }}
          >
            R$ {totalVendas.toFixed(2)}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            Vendas fechadas hoje
          </Text>
        </Card>

        <Card style={{ width: 250 }}>
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Pedidos
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {pedidos}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            Comandas fechadas
          </Text>
        </Card>

        <Card style={{ width: 250 }}>
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Ticket Médio
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            R$ {ticketMedio.toFixed(2)}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            Por comanda
          </Text>
        </Card>

        <Card style={{ width: 250 }}>
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Itens Vendidos
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {itensVendidos}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            Total de itens
          </Text>
        </Card>
      </View>

      <View style={{ flexDirection: "row", gap: 24, marginBottom: 32 }}>
        <Card
          style={{
            width: 500,
            height: 350,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "600" }}>Vendas por Horário</Text>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            Distribuição de vendas ao longo do dia
          </Text>

          <BarChart
            data={barData}
            width={450}
            height={240}
            yAxisLabel=""
            yAxisSuffix=""    
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: () => "#f39c12",
              labelColor: () => "#444",
            }}
            withInnerLines={false}
            showBarTops={false}
            fromZero
          />
        </Card>

        <Card
          style={{
            width: 500,
            height: 350,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "600" }}>Vendas por Categoria</Text>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            Distribuição por tipo de produto
          </Text>

          <PieChart
            data={pieData}
            width={400}
            height={250}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            center={[0, 0]}
            chartConfig={{
              color: () => "#000",
            }}
          />
        </Card>
      </View>

      <Card style={{ width: "100%", marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          Itens Mais Vendidos
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
          Top 5 produtos por faturamento
        </Text>

        {itensMaisVendidos.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>
            Nenhuma venda registrada ainda.
          </Text>
        ) : (
          itensMaisVendidos.map((item, index) => (
            <View
              key={item.nome}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Text
                  style={{
                    backgroundColor: "#ffe7ba",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    fontWeight: "600",
                  }}
                >
                  {index + 1}
                </Text>

                <View>
                  <Text style={{ fontWeight: "600" }}>{item.nome}</Text>
                  <Text style={{ color: colors.textSecondary }}>
                    {item.unidades} unidades vendidas
                  </Text>
                </View>
              </View>

              <Text
                style={{ fontWeight: "600", color: "#16a34a" }}
              >
                R$ {item.valor.toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </Card>
    </PageContainer>
  );
};

export default VendasPage;
