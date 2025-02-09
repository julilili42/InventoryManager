import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Customer, CustomerStatistics } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CircleDollarSign, ShoppingCart, Hash, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCustomerStatistics } from "@/lib/services/statisticService";
import { searchCustomer } from "@/lib/services/customerServices";

export const CustomerDetails = () => {
  const { customer_id } = useParams();
  const navigate = useNavigate();
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
      if (customer_id) {
        const customer = await searchCustomer(Number(customer_id));
        setFetchedCustomer(customer);
      }
    };

    const fetchStatistics = async () => {
      const customer_stats: CustomerStatistics = await getCustomerStatistics();
      setFetchedCustomerStatistics(customer_stats);
    };

    fetchStatistics();
    fetchCustomer();
  }, [customer_id]);

  return (
    <div className="flex flex-col items-start justify-center px-8 mt-8">
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent hover:text-inherit"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft /> Back to Articles
      </Button>
      <Card className="flex flex-col w-full mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">{fetchedCustomer?.name}</CardTitle>
          <CardDescription className="p-0">
            <div className="flex gap-4">
              <div>
                <span className="font-bold">Customer ID: </span>#
                {fetchedCustomer?.customer_id}
              </div>
              <div>
                <span className="font-bold">Name: </span>
                {fetchedCustomer?.first_name} {fetchedCustomer?.last_name}
              </div>
              <div>
                <span className="font-bold">Location: </span>
                {fetchedCustomer?.street} {fetchedCustomer?.location}{" "}
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
                      Number(customer_id)
                    ).number_of_orders
                  }
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <CircleDollarSign />
              <div>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription className="text-xl">
                  {
                    extractCustomerStatistics(
                      fetchedCustomerStatistics,
                      Number(customer_id)
                    ).total_revenue
                  }
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
                      Number(customer_id)
                    ).most_bought_item
                  }
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
