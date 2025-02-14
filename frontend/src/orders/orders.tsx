// orders.tsx
import { useState } from "react";
import { AddOrder } from "./addOrder";
import { OrderDetails } from "./orderDetails/page";
import { TableOrder } from "./page";

export const Orders = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-start h-full gap-8 px-10 overflow-hidden lg:flex-row">
      <div className="lg:w-1/2">
        <AddOrder />
        <OrderDetails order_id={selectedOrderId} />
      </div>
      <div className="w-full lg:w-1/2">
        <TableOrder onRowClick={(id: number) => setSelectedOrderId(id)} />
      </div>
    </div>
  );
};
