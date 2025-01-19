import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { searchOrders } from "@/lib/services/orderServices";
import { Customer, Order, OrderItem } from "@/lib/interfaces";
import { OrderTable } from "../orderTable";
import { columns } from "./columns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { searchCustomer } from "@/lib/services/customerServices";

export const OrderDetails = () => {
  const { order_id } = useParams();
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [fetchedCustomer, setFetchedCustomer] = useState<Customer | null>(null);
  const [fetchedItems, setFetchedItems] = useState<OrderItem[] | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (order_id) {
          const order = await searchOrders(Number(order_id));
          setFetchedOrder(order);
          if (order) {
            const customer = await searchCustomer(order?.customer.customer_id);
            const items = order?.items;
            setFetchedCustomer(customer);
            setFetchedItems(items);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setFetchedOrder(null);
      }
    };

    fetchOrder();
  }, [order_id]);

  const subTotalPrice = (items: OrderItem[] | null): number => {
    if (!items || items.length === 0) return 0;

    const total = items.reduce((sum, item) => {
      return sum + item.article.price * item.quantity;
    }, 0);

    return total;
  };

  const shipping = (): number => {
    return 10;
  };

  const totalPrice = (items: OrderItem[] | null): number => {
    return subTotalPrice(items) + shipping();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full gap-8 px-8">
        <Card className="flex flex-col w-1/2 mt-8">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-xl ">Order #{order_id}</CardTitle>
            <CardDescription>Placed on 18.01.25</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-8">
            {fetchedCustomer ? (
              <Card className="w-1/2 mt-5 shadow-none ">
                <CardHeader className="p-6 pb-1">
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-muted-foreground">
                    {fetchedCustomer.first_name} {fetchedCustomer.last_name}{" "}
                    <br />
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

            <Card className="w-1/2 mt-5 shadow-none ">
              <CardHeader className="p-6 pb-1">
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>Visa ending in **** 123</CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card className="flex flex-col w-1/2 mt-8">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="w-full mx-auto mt-10 rounded-lg">
            <div className="flex justify-between mb-4">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-900">
                {subTotalPrice(fetchedItems).toFixed(2) + " €"}
              </span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-700">Shipping</span>
              <span className="text-gray-900">{shipping() + " €"}</span>
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">
                {totalPrice(fetchedItems).toFixed(2) + " €"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center w-full px-8">
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

        <Card className="flex flex-col w-full px-10 mt-8">
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
      </div>
    </div>
  );
};
