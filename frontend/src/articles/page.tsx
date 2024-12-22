// page.tsx
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useStore } from "@/lib/store";

export function TableArticle() {
  // global
  const { data, fetchData } = useStore();

  // local
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData();
      setLoading(false);
    };
    fetchDataAsync();
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10 mx-auto">
      {data ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <div>Keine Daten verfügbar</div>
      )}
    </div>
  );
}
