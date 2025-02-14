// store.ts
import { create } from "zustand";
import { Article, ArticleSelection, Customer, Order } from "./interfaces";
import { fetchArticles } from "./services/articleService";
import { fetchCustomers } from "./services/customerServices";
import { fetchOrders } from "./services/orderServices";
import { AxiosError } from "axios";

export enum StateKeys {
  ArticleData = "articleData",
  CustomerData = "customerData",
  OrderData = "orderData",
}

export interface NotificationState {
  success: string | null;
  error: AxiosError | null;
}

export interface GlobalState {
  // global states
  notification: NotificationState;
  selectedArticle: ArticleSelection | null;
  articleData: Article[] | null;
  customerData: Customer[] | null;
  orderData: Order[] | null;

  // global state setters
  setNotification: (error: NotificationState) => void;
  setSelectedArticle: (articleSelection: ArticleSelection | null) => void;

  setState: <T>(key: StateKeys, data: T) => void;

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
    notification: { success: null, error: null },
    selectedArticle: null,
    articleData: null,
    customerData: null,
    orderData: null,

    // global state setters
    setNotification: (notification: NotificationState) => {
      set({
        notification: {
          success: notification.success,
          error: notification.error,
        },
      });
    },

    setSelectedArticle: (articleSelection: ArticleSelection | null) =>
      set({ selectedArticle: articleSelection }),

    setState: (key, data) => set({ [key]: data }),

    fetchArticles: async () => {
      try {
        const articles = await fetchArticles();
        updateIfChanged("articleData", articles);
      } catch (error) {
        console.error("Failed to update article data in store.");
      }
    },

    fetchCustomers: async () => {
      try {
        const customers = await fetchCustomers();
        updateIfChanged("customerData", customers);
      } catch (error) {
        console.error("Failed to update customer data in store.");
      }
    },

    fetchOrders: async () => {
      try {
        const orders = await fetchOrders();
        updateIfChanged("orderData", orders);
      } catch (error) {
        console.error("Error while fetching orders:", error);
      }
    },
  };
});
