// operation.ts
import { del, post } from "@/lib/api";
import { Article } from "../../lib/interfaces";
import axios from "axios";

export const addEntry = async (article: Article): Promise<void> => {
  try {
    await post({
      route: "/add_entry",
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
    await post({ route: "/import_csv", body: formData });
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
      await del({ route: `/delete_entry/${articleId}` });
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
