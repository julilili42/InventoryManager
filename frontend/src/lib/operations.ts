// operation.ts
import { del, post } from "@/lib/api";
import { Article } from "./interfaces";
import axios from "axios";

export const addEntry = async (article: Article): Promise<void> => {
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

export const deleteEntries = async (articleIds: number[]): Promise<void> => {
  articleIds.forEach(async (articleId) => {
    try {
      await del({ route: `/articles/delete/${articleId}` });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "Fehler beim Löschen des Eintrags:",
          error.response.data.error
        );
      }
      throw error;
    }
  });
};

export const pdf_gen = async (article: Article): Promise<void> => {
  try {
    const response = await post({
      route: "/articles/pdf_gen",
      body: {
        article_id: article.article_id,
        price: article.price,
        manufacturer: article.manufacturer,
        stock: article.stock,
        ...(article.category && { category: article.category }),
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
    link.download = `article_${article.article_id}.pdf`;
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
