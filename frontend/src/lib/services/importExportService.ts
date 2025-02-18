// importExportService.ts
import { post } from "@/lib/api";
import { Order } from "@/lib/interfaces";
import { handleApiError } from "../error";

const importCSV = async (file: File, route: string): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    await post({ route, body: formData });
  } catch (error) {
    handleApiError(error, "Error while importing csv file:");
  }
};

export const importArticleCSV = (file: File): Promise<void> =>
  importCSV(file, "/articles/import_csv");

export const importCustomerCSV = (file: File): Promise<void> =>
  importCSV(file, "/customers/import_csv");

export const importOrderCSV = (file: File): Promise<void> =>
  importCSV(file, "/orders/import_csv");

export const pdf_gen = async (order: Order): Promise<void> => {
  try {
    const response = await post({
      route: "/operations/pdf",
      body: {
        ...order,
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
    link.download = `Order ${order.order_id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    handleApiError(error, "Error while generating pdf:");
  }
};
