import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type Categoria = "Entrada" | "Prato Principal" | "Sobremesa" | "Bebida";
export type AreaPreparo = "Cozinha" | "Copa";
export type StatusProducao = "Pendente" | "Em Preparo" | "Pronto";
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
}

export interface Comanda {
  id: string;
  mesa: string;
  horaAbertura: string;
  status: StatusComanda;
  itens: ComandaItem[];
}

interface AppDataContextValue {
  menuItems: MenuItem[];
  comandas: Comanda[];

  addMenuItem(data: Omit<MenuItem, "id">): void;
  deleteMenuItem(id: string): void;

  abrirComanda(mesa: string): void;
  adicionarItemNaComanda(
    comandaId: string,
    menuItemId: string,
    quantidade: number
  ): void;
  atualizarStatusItem(
    comandaId: string,
    itemId: string,
    status: StatusProducao
  ): void;
  fecharComanda(comandaId: string): void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(
  undefined
);

const INITIAL_MENU: MenuItem[] = [
  {
    id: "1",
    nome: "Salada Caesar",
    descricao: "Alface romana, croutons, parmesão e molho caesar",
    preco: 28.9,
    categoria: "Entrada",
    areaPreparo: "Copa",
  },
  {
    id: "2",
    nome: "Filé Mignon ao Molho Madeira",
    descricao: "Filé mignon grelhado com molho madeira e batatas",
    preco: 89.9,
    categoria: "Prato Principal",
    areaPreparo: "Cozinha",
  },
  {
    id: "3",
    nome: "Petit Gateau",
    descricao: "Bolinho de chocolate com sorvete de baunilha",
    preco: 24.9,
    categoria: "Sobremesa",
    areaPreparo: "Cozinha",
  },
  {
    id: "4",
    nome: "Suco Natural de Laranja",
    descricao: "Suco natural de laranja 500ml",
    preco: 12.9,
    categoria: "Bebida",
    areaPreparo: "Copa",
  },
];

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [comandas, setComandas] = useState<Comanda[]>([]);

  function addMenuItem(data: Omit<MenuItem, "id">) {
    const novo: MenuItem = {
      ...data,
      id: Date.now().toString(),
    };
    setMenuItems((prev) => [...prev, novo]);
  }

  function deleteMenuItem(id: string) {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  }

  function abrirComanda(mesa: string) {
    const agora = new Date();
    const hora = `${agora.getHours().toString().padStart(2, "0")}:${agora
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const nova: Comanda = {
      id: Date.now().toString(),
      mesa,
      horaAbertura: hora,
      status: "Aberta",
      itens: [],
    };

    setComandas((prev) => [...prev, nova]);
  }

  function adicionarItemNaComanda(
    comandaId: string,
    menuItemId: string,
    quantidade: number
  ) {
    setComandas((prev) =>
      prev.map((c) => {
        if (c.id !== comandaId) return c;

        const menuItem = menuItems.find((m) => m.id === menuItemId);
        if (!menuItem) return c;

        const novoItem: ComandaItem = {
          id: Date.now().toString(),
          menuItemId,
          quantidade,
          status: "Pendente",
          areaPreparo: menuItem.areaPreparo,
        };

        return { ...c, itens: [...c.itens, novoItem] };
      })
    );
  }

  function atualizarStatusItem(
    comandaId: string,
    itemId: string,
    status: StatusProducao
  ) {
    setComandas((prev) =>
      prev.map((c) => {
        if (c.id !== comandaId) return c;
        return {
          ...c,
          itens: c.itens.map((it) =>
            it.id === itemId ? { ...it, status } : it
          ),
        };
      })
    );
  }

  function fecharComanda(comandaId: string) {
    setComandas((prev) =>
      prev.map((c) =>
        c.id === comandaId ? { ...c, status: "Fechada" } : c
      )
    );
  }

  return (
    <AppDataContext.Provider
      value={{
        menuItems,
        comandas,
        addMenuItem,
        deleteMenuItem,
        abrirComanda,
        adicionarItemNaComanda,
        atualizarStatusItem,
        fecharComanda,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  }
  return ctx;
};
