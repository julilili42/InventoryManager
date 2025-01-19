import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Customer, DeliveryStatus, Order } from "@/lib/interfaces";

export const OrderNumber = ({
  fetchedCustomer,
  fetchedOrder,
}: {
  fetchedCustomer: Customer | null;
  fetchedOrder: Order | null;
}) => {
  const orderId = fetchedOrder?.order_id;
  const orderDate = fetchedOrder?.date;
  const orderStatus: DeliveryStatus | null = fetchedOrder
    ? fetchedOrder?.status
    : null;

  const statusBadge = (status: DeliveryStatus | null) => {
    switch (status) {
      case DeliveryStatus.Pending:
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case DeliveryStatus.Completed:
        return <Badge className="bg-green-700">Completed</Badge>;
      case DeliveryStatus.Shipped:
        return <Badge className="bg-blue-700">Shipped</Badge>;
      case DeliveryStatus.Delivered:
        return <Badge className="bg-teal-700">Delivered</Badge>;
    }
  };

  return (
    <Card className="flex flex-col w-1/2 mt-8">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-xl">Order #{orderId}</CardTitle>
        <CardDescription>Placed on {orderDate}</CardDescription>
        <CardDescription>{statusBadge(orderStatus)}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-8">
        {fetchedCustomer ? (
          <Card className="w-1/2 mt-5 shadow-none">
            <CardHeader className="p-6 pb-1">
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-muted-foreground">
                {fetchedCustomer.first_name} {fetchedCustomer.last_name} <br />
                {fetchedCustomer.email}
                <br />
                {fetchedCustomer.street}, {fetchedCustomer.zip_code}{" "}
                {fetchedCustomer.location}
              </span>
            </CardContent>
          </Card>
        ) : (
          <p>Loading customer details or no customer found.</p>
        )}
        <Card className="w-1/2 mt-5 shadow-none">
          <CardHeader className="p-6 pb-1">
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Visa ending in **** 123
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
