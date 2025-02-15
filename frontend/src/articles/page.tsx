// page.tsx
import { useEffect } from "react";
import { columns } from "./columns";
import { ArticleTable } from "./articleTable";
import { useStore } from "@/lib/store";

export function TableArticle({
  onRowClick,
}: {
  onRowClick?: (customerId: number) => void;
}) {
  // global
  const { articleData, fetchArticles } = useStore();

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchArticles();
    };
    fetchDataAsync();
  }, [articleData]);

  return (
    <div className="container py-10 mx-auto">
      {articleData && (
        <ArticleTable
          columns={columns}
          data={articleData}
          showDelete={true}
          showFilter={true}
          showPagination={true}
          showSelect={true}
          showError={true}
          onRowClick={onRowClick}
        />
      )}
    </div>
  );
}
