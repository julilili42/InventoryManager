// page.tsx
import { useEffect } from "react";
import { OrderTable } from "./orderTable";
import { useStore } from "@/lib/store";
import { columns } from "./columns";

export function TableOrder({
  onRowClick,
}: {
  onRowClick?: (customerId: number) => void;
}) {
  // global
  const { orderData, fetchOrders } = useStore();

  useEffect(() => {
    const fetchOrderAsync = async () => {
      await fetchOrders();
    };
    fetchOrderAsync();
  }, [orderData]);

  return (
    <div className="container py-10 mx-auto">
      {orderData && (
        <OrderTable
          columns={columns}
          data={orderData}
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
