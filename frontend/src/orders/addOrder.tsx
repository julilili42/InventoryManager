// addOrder.tsx
import { Order } from "@/lib/interfaces";
import { FormCard } from "@/components/ui/formCard";

export const AddOrder = () => {
  const fields = [
    {
      label: "Order ID",
      name: "order_id",
      placeholder: "Order ID",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Customer",
      name: "customer",
      placeholder: "Customer",
      required: true,
    },
    {
      label: "Articles",
      name: "articles",
      placeholder: "Articles",
      required: true,
    },
  ];

  return (
    <FormCard<Order>
      title="Add new Order"
      fields={fields}
      onSubmit={() => {}}
      onFileImport={() => {}}
      submitLabel="Add Order"
    />
  );
};
