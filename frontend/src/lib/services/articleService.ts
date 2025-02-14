// articleService.ts
import { del, post, get, put } from "@/lib/api";
import { Article } from "@/lib/interfaces";
import { handleApiError } from "../error";

export const fetchArticles = async (): Promise<Article[]> => {
  try {
    return await get({ route: "/articles" });
  } catch (error) {
    handleApiError(error, "Error while fetching articles:");
    throw error;
  }
};

export const addArticle = async (article: Article): Promise<any> => {
  try {
    const request = await post({
      route: "/articles/add",
      body: {
        ...article,
      },
    });
    return request;
  } catch (error) {
    handleApiError(error, "Error while adding article:");
  }
};

export const deleteArticles = async (articleIds: number[]): Promise<void> => {
  articleIds.forEach(async (articleId) => {
    try {
      await del({ route: `/articles/delete/${articleId}` });
    } catch (error) {
      handleApiError(error, "Error while deleting article:");
    }
  });
};

export const updateArticle = async (article: Article): Promise<void> => {
  try {
    await put({
      route: "/articles/update",
      body: {
        ...article,
      },
    });
  } catch (error) {
    handleApiError(error, "Error while updating article:");
  }
};

export const searchArticle = async (article_id: number): Promise<any> => {
  try {
    const article = await get({ route: `/articles/search/${article_id}` });
    return article;
  } catch (error) {
    handleApiError(error, "Error while searching article:");
  }
};
