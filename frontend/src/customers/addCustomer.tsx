// AddCustomer.tsx
import { Customer } from "@/lib/interfaces";
import { FormCard } from "@/components/ui/formCard";
import { useStore } from "@/lib/store";
import { addCustomer } from "@/lib/operations";

export const AddCustomer = () => {
  const { customerData, setCustomer, fetchCustomers } = useStore();

  const fields = [
    {
      label: "Customer ID",
      name: "customer_id",
      placeholder: "Customer ID",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "First name",
      name: "first_name",
      placeholder: "First name",
      required: true,
    },
    {
      label: "Last name",
      name: "last_name",
      placeholder: "Last name",
      required: true,
    },
    {
      label: "Street",
      name: "street",
      placeholder: "Street",
      required: true,
    },
    {
      label: "Location",
      name: "location",
      placeholder: "Location",
      required: true,
    },
    {
      label: "Zip-code",
      name: "zip_code",
      placeholder: "Zip-code",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "E-mail",
      name: "email",
      placeholder: "E-mail",
      required: true,
    },
  ];

  const handleSubmitCustomer = async (newData: Customer) => {
    try {
      console.log(newData);
      await addCustomer(newData);
      await fetchCustomers();
      setCustomer([newData, ...(customerData ?? [])]);
      console.log("Customer added successfully");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <FormCard<Customer>
      title="Add new Customer"
      fields={fields}
      onSubmit={handleSubmitCustomer}
      onFileImport={() => {}}
      submitLabel="Add Customer"
    />
  );
};
