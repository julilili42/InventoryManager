import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/lib/interfaces";
import { OrderTable } from "../orderTable";
import { columns } from "./columns";

export const OrderItems = ({
  fetchedOrder,
}: {
  fetchedOrder: Order | null;
}) => {
  return (
    <Card className="flex flex-col w-full mt-8">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-xl">Order Items</CardTitle>
      </CardHeader>
      <CardContent>
        {fetchedOrder ? (
          <OrderTable
            columns={columns}
            data={fetchedOrder.items ? fetchedOrder.items : []}
          />
        ) : (
          <p>Loading order details or no order found.</p>
        )}
      </CardContent>
    </Card>
  );
};
