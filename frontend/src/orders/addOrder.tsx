// addOrder.tsx
import {
  Customer,
  DeliveryStatus,
  Order,
  OrderItem,
  OrderType,
} from "@/lib/interfaces";
import { StateKeys, useStore } from "@/lib/store";
import { searchCustomer } from "@/lib/services/customerServices";
import { addOrder } from "@/lib/services/orderServices";
import { FormCardOrder } from "@/components/ui/formCardOrder";

export const AddOrder = () => {
  const {
    orderData,
    setState,
    fetchOrders,
    selectedArticle,
    setSelectedArticle,
  } = useStore();
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
    const customer: Customer = await searchCustomer(input.customer_id);
    const orderId: number = input.order_id;

    /* const fetched_article: Article = await searchArticle(input.article_id);
    const quantity: number = input.quantity;
    const orderItems: OrderItem[] = [{ article: fetched_article, quantity }]; */

    const orderItems: OrderItem[] | null =
      selectedArticle?.selectedArticles.flatMap((item) =>
        item.article && item.quantity
          ? [{ article: item.article, quantity: item.quantity }]
          : []
      ) ?? null;

    const orderDate: string = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

    const orderType: OrderType = input.order_type;
    const status: DeliveryStatus = input.status;

    if (orderItems) {
      const newData: Order = {
        order_id: orderId,
        customer: customer,
        items: orderItems,
        date: orderDate,
        order_type: orderType,
        status: status,
      };

      try {
        await addOrder(newData);
        await fetchOrders();
        setState(StateKeys.OrderData, [newData, ...(orderData ?? [])]);
        setSelectedArticle(null);

        console.log("Order added successfully");
      } catch (error) {
        console.error("Error adding Order:", error);
      }
    }
  };

  return (
    <div>
      <FormCardOrder<Order>
        title="Add new Order"
        fields={fields}
        onSubmit={handleSubmitOrder}
        onFileImport={() => {}}
        submitLabel="Add Order"
      />
    </div>
  );
};
