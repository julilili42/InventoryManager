// customers.tsx
import { useState } from "react";
import { AddCustomer } from "./addCustomer";
import { CustomerDetails } from "./customerDetails";
import { TableCustomer } from "./page";

export const Customers = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  return (
    <div className="flex flex-col items-start h-full gap-8 px-10 mt-8 lg:flex-row">
      <div className="grid grid-rows-2 lg:mt-18 lg:w-1/2">
        <AddCustomer />
        <CustomerDetails customerId={selectedCustomerId} />
      </div>
      <div className="w-full lg:mt-18 lg:w-1/2">
        <TableCustomer onRowClick={(id: number) => setSelectedCustomerId(id)} />
      </div>
    </div>
  );
};
