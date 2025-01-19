// addOrder.tsx
import {
  Article,
  Customer,
  DeliveryStatus,
  Order,
  OrderItem,
  OrderType,
} from "@/lib/interfaces";
import { FormCard } from "@/components/ui/formCard";
import { useStore } from "@/lib/store";
import { searchArticle } from "@/lib/services/articleService";
import { searchCustomer } from "@/lib/services/customerServices";
import { addOrder } from "@/lib/services/orderServices";

export const AddOrder = () => {
  const { orderData, setOrder, fetchOrders } = useStore();
  const fields = [
    {
      label: "Order ID",
      name: "order_id",
      placeholder: "Order ID",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Customer ID",
      name: "customer_id",
      placeholder: "Customer ID",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Article ID",
      name: "article_id",
      placeholder: "Article ID",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Quantity",
      name: "quantity",
      placeholder: "Quantity",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Type",
      name: "order_type",
      placeholder: "Type",
      valueAsNumber: false,
      required: true,
    },
    {
      label: "Status",
      name: "status",
      placeholder: "Status",
      valueAsNumber: false,
      required: true,
    },
  ];

  const handleSubmitOrder = async (input: any) => {
    const fetched_article: Article = await searchArticle(input.article_id);
    const customer: Customer = await searchCustomer(input.customer_id);

    const orderId: number = input.order_id;
    const quantity: number = input.quantity;
    const orderItems: OrderItem[] = [{ article: fetched_article, quantity }];

    const orderDate: string = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

    const orderType: OrderType = input.order_type;
    const status: DeliveryStatus = input.status;

    const newData: Order = {
      order_id: orderId,
      customer: customer,
      items: orderItems,
      date: orderDate,
      order_type: orderType,
      status: status,
    };

    try {
      console.log(newData);
      await addOrder(newData);
      await fetchOrders();
      setOrder([newData, ...(orderData ?? [])]);
      console.log("Order added successfully");
    } catch (error) {
      console.error("Error adding Order:", error);
    }
  };

  return (
    <FormCard<Order>
      title="Add new Order"
      fields={fields}
      onSubmit={handleSubmitOrder}
      onFileImport={() => {}}
      submitLabel="Add Order"
    />
  );
};
