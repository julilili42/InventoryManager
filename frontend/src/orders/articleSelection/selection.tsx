import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArticleTable } from "@/articles/articleTable";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { ArticleSelection } from "@/lib/interfaces";
import { columns } from "./columns";

export const OrderSelection = () => {
  // global
  const { articleData, fetchArticles, setSelectedArticle } = useStore();

  // local
  const [pendingSelection, setPendingSelection] =
    useState<ArticleSelection | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchArticles();
    };
    fetchDataAsync();
  }, [articleData]);

  const getSelectedArticles = (article_selection: ArticleSelection) => {
    setPendingSelection(article_selection);
  };

  const saveSelectedArticles = () => {
    setSelectedArticle(pendingSelection);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className="w-full">
          Select Articles
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Article Selection</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <ArticleTable
                columns={columns}
                data={articleData ?? []}
                pageSize={5}
                onSelectionChange={getSelectedArticles}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={saveSelectedArticles}>
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
