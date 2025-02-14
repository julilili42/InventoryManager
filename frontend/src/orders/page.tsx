// page.tsx
import { useEffect, useState } from "react";
import { OrderTable } from "./orderTable";
import { useStore } from "@/lib/store";
import { columns } from "./columns";

export function TableOrder() {
  // global
  const { orderData, fetchOrders } = useStore();

  // local
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderAsync = async () => {
      await fetchOrders();
      setLoading(false);
    };
    fetchOrderAsync();
  }, [orderData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10 mx-auto">
      {orderData ? (
        <OrderTable
          columns={columns}
          data={orderData}
          showDelete={true}
          showFilter={true}
          showPagination={true}
          showSelect={true}
          showError={true}
        />
      ) : (
        <div>Keine Daten verfügbar</div>
      )}
    </div>
  );
}
