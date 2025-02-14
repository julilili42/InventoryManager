import { useEffect, useState } from "react";
import { searchOrders } from "@/lib/services/orderServices";
import { Order } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { pdf_gen } from "@/lib/services/importExportService";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderTable } from "../orderTable";
import { columns } from "./columns";

export const OrderDetails = ({ order_id }: { order_id: number | null }) => {
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (order_id) {
          const order = await searchOrders(Number(order_id));
          setFetchedOrder(order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setFetchedOrder(null);
      }
    };

    fetchOrder();
  }, [order_id]);

  return (
    <div className="flex flex-col pb-8">
      <Card className="items-start justify-center w-full mt-10">
        {order_id && (
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Order Details
            </CardTitle>
          </CardHeader>
        )}
        {order_id ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={order_id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 pt-0">
                <Card className="flex flex-col w-full">
                  <CardHeader>
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
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    if (fetchedOrder) {
                      pdf_gen(fetchedOrder);
                    } else {
                      console.error("Missing data: fetchedOrder");
                    }
                  }}
                >
                  <Printer /> Print Order
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Click on Order to view Details
            </CardTitle>
          </CardHeader>
        )}
      </Card>
    </div>
  );
};
