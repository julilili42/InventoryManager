// customerDetails.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Customer, CustomerStatistics } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { HandCoins, ShoppingCart, Hash } from "lucide-react";
import { getCustomerStatistics } from "@/lib/services/statisticService";
import { searchCustomer } from "@/lib/services/customerServices";

export const CustomerDetails = ({
  customerId,
}: {
  customerId: number | null;
}) => {
  const [fetchedCustomer, setFetchedCustomer] = useState<Customer | null>(null);
  const [fetchedCustomerStatistics, setFetchedCustomerStatistics] =
    useState<CustomerStatistics | null>(null);

  const extractCustomerStatistics = (
    customer_stats: CustomerStatistics | null,
    id: number
  ) => ({
    number_of_orders: customer_stats?.number_of_orders[id] ?? "Not available",
    total_revenue: customer_stats?.total_revenue[id] ?? "Not available",
    most_bought_item: customer_stats?.most_bought_item[id] ?? "Not available",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      if (customerId) {
        const customer = await searchCustomer(Number(customerId));
        setFetchedCustomer(customer);
      }
    };

    const fetchStatistics = async () => {
      const customer_stats: CustomerStatistics = await getCustomerStatistics();
      setFetchedCustomerStatistics(customer_stats);
    };

    fetchStatistics();
    fetchCustomer();
  }, [customerId]);

  return (
    <div className="flex flex-col items-start justify-center w-full mt-8">
      <Card className="flex flex-col w-full mt-8">
        {customerId ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Customer Statistics
              </CardTitle>
              <CardDescription className="p-0">
                <div className="flex justify-center gap-4">
                  <div className="text-l">
                    <span className="font-bold">Customer ID: </span>#
                    {fetchedCustomer?.customer_id}
                  </div>
                  <div className="text-l">
                    <span className="font-bold">Name: </span>
                    {fetchedCustomer?.first_name} {fetchedCustomer?.last_name}
                  </div>
                  <div className="text-l">
                    <span className="font-bold">Location: </span>
                    {fetchedCustomer?.street}, {fetchedCustomer?.location}{" "}
                    {fetchedCustomer?.zip_code}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                  <Hash />
                  <div>
                    <CardTitle>Number of Orders</CardTitle>
                    <CardDescription className="text-xl">
                      {
                        extractCustomerStatistics(
                          fetchedCustomerStatistics,
                          Number(customerId)
                        ).number_of_orders
                      }
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                  <HandCoins />
                  <div>
                    <CardTitle>Total Revenue</CardTitle>
                    <CardDescription className="text-xl">
                      {typeof extractCustomerStatistics(
                        fetchedCustomerStatistics,
                        Number(customerId)
                      ).total_revenue === "number"
                        ? `${
                            extractCustomerStatistics(
                              fetchedCustomerStatistics,
                              Number(customerId)
                            ).total_revenue
                          } €`
                        : extractCustomerStatistics(
                            fetchedCustomerStatistics,
                            Number(customerId)
                          ).total_revenue}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                  <ShoppingCart />
                  <div>
                    <CardTitle>Most bought item</CardTitle>
                    <CardDescription className="text-xl">
                      {
                        extractCustomerStatistics(
                          fetchedCustomerStatistics,
                          Number(customerId)
                        ).most_bought_item
                      }
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </CardContent>
          </>
        ) : (
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Click on Customer to view Statistics
            </CardTitle>
          </CardHeader>
        )}
      </Card>
    </div>
  );
};
