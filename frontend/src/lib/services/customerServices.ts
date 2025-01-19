//customerServices.ts
import { del, post, get } from "@/lib/api";
import { Customer } from "@/lib/interfaces";
import { handleApiError } from "../error";

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    return await get({ route: "/customers" });
  } catch (error) {
    handleApiError(error, "Error while fetching customers:");
    throw error;
  }
};

export const addCustomer = async (customer: Customer): Promise<void> => {
  try {
    await post({
      route: "/customers/add",
      body: {
        ...customer,
      },
    });
  } catch (error) {
    handleApiError(error, "Error while adding customer:");
  }
};

export const deleteCustomers = async (customerIds: number[]): Promise<void> => {
  customerIds.forEach(async (customerId) => {
    try {
      await del({ route: `/customers/delete/${customerId}` });
    } catch (error) {
      handleApiError(error, "Error while deleting customer:");
    }
  });
};

export const searchCustomer = async (customer_id: number): Promise<any> => {
  try {
    const customer = await get({ route: `/customers/search/${customer_id}` });
    return customer;
  } catch (error) {
    handleApiError(error, "Error while searching customer:");
  }
};
