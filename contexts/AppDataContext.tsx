import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api";

// --- TIPAGENS ---
export type Categoria = "Entrada" | "Prato Principal" | "Sobremesa" | "Bebida";
export type AreaPreparo = "Cozinha" | "Copa";
export type StatusProducao = "Pendente" | "Em Preparo" | "Pronto" | "Entregue";
export type StatusComanda = "Aberta" | "Fechada";

export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: Categoria;
  areaPreparo: AreaPreparo;
}

export interface ComandaItem {
  id: string;
  menuItemId: string;
  quantidade: number;
  status: StatusProducao;
  areaPreparo: AreaPreparo;
  nomeItem?: string;
}

export interface Comanda {
  id: string;
  mesa: string;
  horaAbertura: string;
  status: StatusComanda;
  itens: ComandaItem[];
  total?: number;
}

interface AppDataContextValue {
  menuItems: MenuItem[];
  comandas: Comanda[];
  comandasFechadas: Comanda[]; // NOVA LISTA PARA RELATÓRIOS
  isLoading: boolean;

  refreshData(): Promise<void>;
  addMenuItem(data: Omit<MenuItem, "id">): Promise<void>;
  deleteMenuItem(id: string): Promise<void>;
  abrirComanda(mesa: string): Promise<void>;
  adicionarItemNaComanda(comandaId: string, menuItemId: string, quantidade: number): Promise<void>;
  atualizarStatusItem(comandaId: string, itemId: string, status: StatusProducao): Promise<void>;
  fecharComanda(comandaId: string): Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [comandasFechadas, setComandasFechadas] = useState<Comanda[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  // Função auxiliar para formatar itens vindos da API
  const formatarItens = (itensAPI: any[]): ComandaItem[] => {
    return (itensAPI || []).map((it: any) => ({
      id: it.id.toString(),
      menuItemId: it.itemCardapioId ? it.itemCardapioId.toString() : "",
      quantidade: it.quantidade,
      status: mapStatusBackendToFrontend(it.status),
      areaPreparo: it.item?.tipo === 'BEBIDA' ? 'Copa' : 'Cozinha',
      nomeItem: it.item?.nome
    }));
  };

  async function refreshData() {
    setIsLoading(true);
    try {
      // 1. CARREGAR CARDÁPIO
      const responseMenu = await api.get("/cardapio");
      const menuFormatado: MenuItem[] = responseMenu.data.map((item: any) => {
        let cat: Categoria = "Prato Principal";
        let area: AreaPreparo = "Cozinha";
        if (item.tipo === "BEBIDA") { cat = "Bebida"; area = "Copa"; }
        return {
          id: item.id.toString(),
          nome: item.nome,
          descricao: item.descricao,
          preco: Number(item.preco),
          categoria: cat,
          areaPreparo: area,
        };
      });
      setMenuItems(menuFormatado);

      // 2. CARREGAR COMANDAS ABERTAS (Detalhado para KDS)
      const responseAbertas = await api.get("/comandas/abertas");
      const abertasDetalhadas = await Promise.all(
        responseAbertas.data.map(async (c: any) => {
          try {
            const detalhe = await api.get(/comandas/${c.id});
            return {
              id: c.id.toString(),
              mesa: c.numeroMesa.toString(),
              horaAbertura: new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              status: "Aberta" as StatusComanda,
              itens: formatarItens(detalhe.data.itens),
              total: Number(detalhe.data.valorTotal || 0)
            };
          } catch { return null; }
        })
      );
      setComandas(abertasDetalhadas.filter(c => c !== null) as Comanda[]);

      // 3. CARREGAR COMANDAS FECHADAS (Para o Relatório de Vendas)
      // Importante: Você precisa ter certeza que seu backend tem uma rota para listar todas ou fechadas.
      // Se não tiver, o axios vai dar erro 404. Vamos tentar usar a rota genérica se existir, ou filtrar.
      // Assumindo que você criou a rota de relatorioController ou uma rota GET /comandas geral.
      // Como plano B, vamos deixar vazio se der erro para não travar o app.
      try {
         // Ajuste isso para a rota que retorna comandas fechadas no seu back
         // Se não tiver rota específica, pule essa parte.
         // Estou assumindo que você pode adicionar: routes.get('/comandas', comandaController.indexAll);
      } catch (e) { console.log("Erro ao buscar vendas"); }

    } catch (error) {
      console.error("Erro geral:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function mapStatusBackendToFrontend(statusUpper: string): StatusProducao {
    const map: Record<string, StatusProducao> = {
      'PENDENTE': 'Pendente', 'EM_PREPARO': 'Em Preparo', 'PRONTO': 'Pronto', 'ENTREGUE': 'Entregue'
    };
    return map[statusUpper] || 'Pendente';
  }

  function mapStatusFrontendToBackend(statusView: StatusProducao): string {
    const map: Record<string, string> = {
      'Pendente': 'PENDENTE', 'Em Preparo': 'EM_PREPARO', 'Pronto': 'PRONTO', 'Entregue': 'ENTREGUE'
    };
    return map[statusView] || 'PENDENTE';
  }

  // AÇÕES
  async function addMenuItem(data: Omit<MenuItem, "id">) {
    try {
      await api.post("/cardapio", {
        nome: data.nome, descricao: data.descricao, preco: data.preco,
        tipo: data.categoria === "Bebida" ? "BEBIDA" : "PRATO"
      });
      refreshData();
    } catch (e) { alert("Erro ao criar item"); }
  }

  async function deleteMenuItem(id: string) {
    await api.delete(/cardapio/${id});
    refreshData();
  }

  async function abrirComanda(mesa: string) {
    try {
      await api.post("/comandas", { numeroMesa: parseInt(mesa) });
      refreshData();
    } catch (e: any) { alert(e.response?.data?.error || "Erro"); }
  }

  async function adicionarItemNaComanda(comandaId: string, menuItemId: string, quantidade: number) {
    await api.post(/comandas/${comandaId}/adicionar, {
      itemCardapioId: parseInt(menuItemId), quantidade, observacao: ""
    });
    refreshData();
  }

  async function atualizarStatusItem(comandaId: string, itemId: string, status: StatusProducao) {
    await api.put(/pedidos/${itemId}/status, { status: mapStatusFrontendToBackend(status) });
    refreshData();
  }

  async function fecharComanda(comandaId: string) {
    await api.put(/comandas/${comandaId}/fechar);
    refreshData();
  }

  return (
    <AppDataContext.Provider
      value={{
        menuItems, comandas, comandasFechadas, isLoading,
        refreshData, addMenuItem, deleteMenuItem, abrirComanda,
        adicionarItemNaComanda, atualizarStatusItem, fecharComanda
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  return ctx;
};
