// page.tsx
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { CustomerTable } from "./customerTable";
import { useStore } from "@/lib/store";

export function TableCustomer() {
  // global
  const { customerData, fetchCustomers } = useStore();

  // local
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchCustomers();
      setLoading(false);
    };
    fetchDataAsync();
  }, [customerData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10 mx-auto">
      {customerData ? (
        <CustomerTable columns={columns} data={customerData} />
      ) : (
        <div>Keine Daten verfügbar</div>
      )}
    </div>
  );
}
