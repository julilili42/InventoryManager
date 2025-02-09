import { handleApiError } from "@/lib/error";
import { get } from "@/lib/api";
import {
  Statistics,
  OrderStatistics,
  ArticleStatistics,
  CustomerStatistics,
} from "../interfaces";

const getStatistics = async () => {
  try {
    return await get({ route: "/operations/statistics" });
  } catch (error) {
    handleApiError(error, "Error while fetching statistics:");
    throw error;
  }
};

export const getArticleStatistics = async (): Promise<ArticleStatistics> => {
  const statistics: Statistics = await getStatistics();
  return statistics.article_statistics;
};

export const getOrderStatistics = async (): Promise<OrderStatistics> => {
  const statistics: Statistics = await getStatistics();
  return statistics.order_statistics;
};

export const getCustomerStatistics = async (): Promise<CustomerStatistics> => {
  const statistics: Statistics = await getStatistics();
  return statistics.customer_statistics;
};

export const getTotalPrice = async (): Promise<{ [key: number]: number }> => {
  const order_statistics: OrderStatistics = await getOrderStatistics();
  return order_statistics.total_prices;
};
