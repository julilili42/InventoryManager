// customers.tsx
import { AddCustomer } from "./addCustomer";
import { TableCustomer } from "./page";

export const Customers = () => {
  return (
    <div className="flex flex-col items-start h-full gap-8 px-10 mt-8 lg:flex-row">
      <div className="w-full lg:mt-18 lg:w-1/2">
        <AddCustomer />
      </div>
      <div className="w-full lg:mt-18 lg:w-1/2">
        <TableCustomer />
      </div>
    </div>
  );
};
