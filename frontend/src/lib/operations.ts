// operation.ts
import { del, post, get, put } from "@/lib/api";
import { Article, Customer, Order } from "./interfaces";
import axios from "axios";

export const addArticle = async (article: Article): Promise<void> => {
  try {
    await post({
      route: "/articles/add",
      body: {
        article_id: article.article_id,
        price: article.price,
        manufacturer: article.manufacturer,
        stock: article.stock,
        ...(article.category && { category: article.category }),
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Fehler beim Hinzufügen des Eintrags:",
        error.response.data.error
      );
    }
    throw error;
  }
};

export const addCustomer = async (customer: Customer): Promise<void> => {
  try {
    await post({
      route: "/customers/add",
      body: {
        customer_id: customer.customer_id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        street: customer.street,
        location: customer.location,
        zip_code: customer.zip_code,
        email: customer.email,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Fehler beim Hinzufügen des Eintrags:",
        error.response.data.error
      );
    }
    throw error;
  }
};

export const addOrder = async (order: Order): Promise<void> => {
  try {
    await post({
      route: "/orders/add",
      body: {
        order_id: order.order_id,
        customer: order.customer,
        items: order.items,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Fehler beim Hinzufügen des Eintrags:",
        error.response.data.error
      );
    }
    throw error;
  }
};

export const importCSV = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    await post({ route: "/articles/import_csv", body: formData });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Fehler beim Importieren der CSV-Datei:",
        error.response.data.error
      );
    }
    throw error;
  }
};

export const deleteArticles = async (articleIds: number[]): Promise<void> => {
  articleIds.forEach(async (articleId) => {
    try {
      await del({ route: `/articles/delete/${articleId}` });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "Error when deleting article:",
          error.response.data.error
        );
      }
      throw error;
    }
  });
};

export const updateArticle = async (article: Article): Promise<void> => {
  try {
    await put({
      route: "/articles/update",
      body: {
        article_id: article.article_id,
        price: article.price,
        manufacturer: article.manufacturer,
        stock: article.stock,
        ...(article.category && { category: article.category }),
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error when updating article:", error.response.data.error);
    }
    throw error;
  }
};

export const searchArticle = async (article_id: number): Promise<any> => {
  try {
    const article = await get({ route: `/articles/search/${article_id}` });
    return article;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error when searching article:", error.response.data.error);
    }
    throw error;
  }
};

export const deleteCustomers = async (customerIds: number[]): Promise<void> => {
  customerIds.forEach(async (customerId) => {
    try {
      await del({ route: `/customers/delete/${customerId}` });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "Error when deleting customer:",
          error.response.data.error
        );
      }
      throw error;
    }
  });
};

export const searchCustomer = async (customer_id: number): Promise<any> => {
  try {
    const customer = await get({ route: `/customers/search/${customer_id}` });
    return customer;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Error when searching customer:",
        error.response.data.error
      );
    }
    throw error;
  }
};

export const deleteOrders = async (orderIds: number[]): Promise<void> => {
  orderIds.forEach(async (orderId) => {
    try {
      await del({ route: `/orders/delete/${orderId}` });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error when deleting order:", error.response.data.error);
      }
      throw error;
    }
  });
};

export interface pdfRequest {
  article: Article;
  customer: Customer;
}

export const pdf_gen = async (data: pdfRequest): Promise<void> => {
  try {
    const response = await post({
      route: "/operations/pdf",
      body: {
        articles: {
          article_id: data.article.article_id,
          price: data.article.price,
          manufacturer: data.article.manufacturer,
          stock: data.article.stock,
          ...(data.article.category && { category: data.article.category }),
        },
        customer: {
          customer_id: data.customer.customer_id,
          first_name: data.customer.first_name,
          last_name: data.customer.last_name,
          email: data.customer.email,
          location: data.customer.location,
          street: data.customer.street,
          zip_code: data.customer.zip_code,
        },
      },
      responseType: "blob",
    });

    const blob =
      response instanceof Blob
        ? response
        : new Blob([response], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `article_${data.article.article_id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Fehler beim Generieren des PDF:",
        error.response.data.error
      );
    }
    throw error;
  }
};
