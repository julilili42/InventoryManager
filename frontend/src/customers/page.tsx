// page.tsx
import { useEffect } from "react";
import { columns } from "./columns";
import { CustomerTable } from "./customerTable";
import { useStore } from "@/lib/store";

export function TableCustomer({
  onRowClick,
}: {
  onRowClick?: (customerId: number) => void;
}) {
  // global
  const { customerData, fetchCustomers } = useStore();

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchCustomers();
    };
    fetchDataAsync();
  }, [customerData]);

  return (
    <div className="container py-10 mx-auto">
      {customerData && (
        <CustomerTable
          columns={columns}
          data={customerData}
          onRowClick={onRowClick}
        />
      )}
    </div>
  );
}
