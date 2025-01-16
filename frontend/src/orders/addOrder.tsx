// addOrder.tsx
import { Order } from "@/lib/interfaces";
import { FormCard } from "@/components/ui/formCard";
import { addOrder, searchArticle, searchCustomer } from "@/lib/operations";
import { useStore } from "@/lib/store";

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
  ];

  const handleSubmitOrder = async (input: any) => {
    const fetched_article = await searchArticle(input.article_id);
    const customer = await searchCustomer(input.customer_id);
    const order_id = input.order_id;
    const quantity = input.quantity;

    const newData = {
      order_id: order_id,
      customer: customer,
      items: [{ article: fetched_article, quantity }],
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
