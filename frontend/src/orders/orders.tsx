// orders.tsx
import { AddOrder } from "./addOrder";
import { OrderLog } from "./orderLog";
import { TableOrder } from "./page";

export const Orders = () => {
  return (
    <div className="flex flex-col items-start h-full gap-8 px-10 mt-8 lg:flex-row">
      <div className="w-full lg:mt-18 lg:w-1/2">
        <AddOrder />
        <div className="flex items-center gap-8 mt-8">
          <OrderLog />
        </div>
      </div>
      <div className="w-full lg:mt-18 lg:w-1/2">
        <TableOrder />
      </div>
    </div>
  );
};
