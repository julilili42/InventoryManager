// addCustomer.tsx
import { Customer } from "@/lib/interfaces";
import { FormCard } from "@/components/ui/formCard";
import { StateKeys, useStore } from "@/lib/store";
import { addCustomer } from "@/lib/services/customerServices";
import { isAxiosError } from "axios";
import { importCustomerCSV } from "@/lib/services/importExportService";

export const AddCustomer = () => {
  const { customerData, setState, fetchCustomers, setNotification } =
    useStore();

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
      const request = await addCustomer(newData);
      await fetchCustomers();
      setState(StateKeys.CustomerData, [newData, ...(customerData ?? [])]);
      setNotification({ success: request.message, error: null });
      console.log("Customer added successfully");
      setTimeout(() => setNotification({ success: null, error: null }), 5000);
    } catch (error) {
      if (isAxiosError(error)) {
        setNotification({ success: null, error });
        console.error("Error adding customer:", error);
        setTimeout(() => setNotification({ success: null, error: null }), 5000);
      } else {
        console.error("Error adding customer (no axios error):", error);
      }
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await importCustomerCSV(e.target.files[0]);
      await fetchCustomers();
    }
  };

  return (
    <FormCard<Customer>
      title="Add new Customer"
      fields={fields}
      onSubmit={handleSubmitCustomer}
      onFileImport={handleFileImport}
      submitLabel="Add Customer"
    />
  );
};
