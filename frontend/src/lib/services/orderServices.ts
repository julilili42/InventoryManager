// orderServices.ts
import { del, post, get } from "@/lib/api";
import { Order } from "@/lib/interfaces";
import { handleApiError } from "../error";

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    return await get({ route: "/orders" });
  } catch (error) {
    handleApiError(error, "Error while fetching orders:");
    throw error;
  }
};

export const addOrder = async (order: Order): Promise<any> => {
  try {
    const request = await post({
      route: "/orders/add",
      body: {
        ...order,
      },
    });
    return request;
  } catch (error) {
    handleApiError(error, "Error while adding order:");
  }
};

export const deleteOrders = async (orderIds: number[]): Promise<void> => {
  orderIds.forEach(async (orderId) => {
    try {
      await del({ route: `/orders/delete/${orderId}` });
    } catch (error) {
      handleApiError(error, "Error while deleting order:");
    }
  });
};

export const searchOrders = async (order_id: number): Promise<Order | null> => {
  try {
    const order = await get({ route: `/orders/search/${order_id}` });
    return order;
  } catch (error) {
    handleApiError(error, "Error while searching order:");
    return null;
  }
};
