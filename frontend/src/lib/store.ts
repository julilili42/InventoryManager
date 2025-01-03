// store.ts
import { create } from "zustand";
import { Article, Customer, Order } from "./interfaces";
import { get } from "./api";

export interface GlobalState {
  // global states
  selectedArticle: Article | null;
  articleData: Article[] | null;
  customerData: Customer[] | null;
  orderData: Order[] | null;

  // global state setters
  setSelectedArticle: (id: Article | null) => void;
  setArticle: (data: Article[] | null) => void;
  setCustomer: (data: Customer[] | null) => void;
  setOrder: (data: Order[] | null) => void;

  fetchArticles: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
  fetchOrders: () => Promise<void>;
}

export const useStore = create<GlobalState>((set) => {
  const updateIfChanged = <T>(key: keyof GlobalState, newData: T) => {
    set((state: GlobalState) => {
      if (JSON.stringify(state[key]) === JSON.stringify(newData)) {
        return {};
      }
      return { [key]: newData };
    });
  };

  return {
    // global states
    selectedArticle: null,
    articleData: null,
    customerData: null,
    orderData: null,

    // global state setters
    setSelectedArticle: (article: Article | null) =>
      set({ selectedArticle: article }),
    setArticle: (articleData: Article[] | null) => set({ articleData }),
    setCustomer: (customerData: Customer[] | null) => set({ customerData }),
    setOrder: (orderData: Order[] | null) => set({ orderData }),

    fetchArticles: async () => {
      try {
        const json = await get({ route: "/articles" });
        updateIfChanged<Article>("articleData", json);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    },

    fetchCustomers: async () => {
      try {
        const json = await get({ route: "/customers" });
        updateIfChanged<Customer>("customerData", json);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    },

    fetchOrders: async () => {
      try {
        const json = await get({ route: "/orders" });
        updateIfChanged<Order>("orderData", json);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    },
  };
});
