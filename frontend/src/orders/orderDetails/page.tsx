import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { searchOrders } from "@/lib/services/orderServices";
import { Customer, Order, OrderItem } from "@/lib/interfaces";
import { searchCustomer } from "@/lib/services/customerServices";
import { OrderSummary } from "./orderSummary";
import { OrderNumber } from "./orderNumber";
import { OrderItems } from "./OrderItems";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Pen } from "lucide-react";
import { pdf_gen } from "@/lib/services/importExportService";

export const OrderDetails = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();
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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between w-full px-8 mt-8">
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent hover:text-inherit"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft /> Back to Orders
        </Button>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => {
              if (fetchedItems && fetchedCustomer) {
                pdf_gen({
                  article: fetchedItems[0].article,
                  customer: fetchedCustomer,
                });
              } else {
                console.error("Missing data: fetchedItems or fetchedCustomer");
              }
            }}
          >
            <Printer /> Print Order
          </Button>
          <Button variant="default" className="">
            <Pen /> Edit Order
          </Button>
        </div>
      </div>
      <div className="flex w-full gap-8 px-8">
        <OrderNumber
          fetchedCustomer={fetchedCustomer}
          fetchedOrder={fetchedOrder}
        />
        <OrderSummary fetchedItems={fetchedItems} />
      </div>

      <div className="flex flex-col items-center justify-center w-full px-8">
        <OrderItems fetchedOrder={fetchedOrder} />
      </div>
    </div>
  );
};
