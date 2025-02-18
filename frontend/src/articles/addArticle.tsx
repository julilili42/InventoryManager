// addArticle.tsx
import { Article } from "@/lib/interfaces";
import { addArticle } from "@/lib/services/articleService";
import { importArticleCSV } from "@/lib/services/importExportService";
import { isAxiosError } from "axios";
import { StateKeys, useStore } from "@/lib/store";
import { FormCard } from "@/components/ui/formCard";

export const AddArticle = () => {
  const { articleData, setState, fetchArticles, setNotification } = useStore();

  const fields = [
    {
      label: "Article ID",
      name: "article_id",
      placeholder: "Article ID",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Name",
      name: "name",
      placeholder: "Name",
      valueAsNumber: false,
      required: true,
    },
    {
      label: "Price",
      name: "price",
      placeholder: "Price",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Stock",
      name: "stock",
      placeholder: "Stock",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Manufacturer",
      name: "manufacturer",
      placeholder: "Manufacturer",
    },
    {
      label: "Category",
      name: "category",
      placeholder: "Category",
    },
  ];

  const handleSubmitArticle = async (newData: Article) => {
    try {
      const request = await addArticle(newData);
      await fetchArticles();
      setState(StateKeys.ArticleData, [newData, ...(articleData ?? [])]);
      setNotification({ success: request.message, error: null });
      console.log("Article added successfully");
      setTimeout(() => setNotification({ success: null, error: null }), 5000);
    } catch (error) {
      if (isAxiosError(error)) {
        setNotification({ success: null, error });
        console.error("Error adding article:", error);
        setTimeout(() => setNotification({ success: null, error: null }), 5000);
      } else {
        console.error("Error adding article (no axios error):", error);
      }
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await importArticleCSV(e.target.files[0]);
      await fetchArticles();
    }
  };

  return (
    <FormCard<Article>
      title="Add new Article"
      fields={fields}
      onSubmit={handleSubmitArticle}
      onFileImport={handleFileImport}
      submitLabel="Add article"
    />
  );
};
