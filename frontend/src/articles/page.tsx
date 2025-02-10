// page.tsx
import { useEffect, useState } from "react";
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

  // local
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchArticles();
      setLoading(false);
    };
    fetchDataAsync();
  }, [articleData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10 mx-auto">
      {articleData ? (
        <ArticleTable
          columns={columns}
          data={articleData}
          showDelete={true}
          showFilter={true}
          showPagination={true}
          showSelect={true}
          onRowClick={onRowClick}
        />
      ) : (
        <div>Keine Daten verfügbar</div>
      )}
    </div>
  );
}
