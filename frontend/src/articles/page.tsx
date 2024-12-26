// page.tsx
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./articleTable";
import { useStore } from "@/lib/store";

export function TableArticle() {
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
        <DataTable columns={columns} data={articleData} />
      ) : (
        <div>Keine Daten verfügbar</div>
      )}
    </div>
  );
}
