// AddCustomer.tsx
import { Customer } from "@/lib/interfaces";
import { FormCard } from "@/components/ui/formCard";

export const AddCustomer = () => {
  const fields = [
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

  return (
    <FormCard<Customer>
      title="Add new Customer"
      fields={fields}
      onSubmit={() => {}}
      onFileImport={() => {}}
      submitLabel="Add Customer"
    />
  );
};

/*   const handleSubmitCustomer = async (newData: Customer) => {
    try {
      // z. B. in der DB speichern
      await addEntry(newData);
      await fetchData();
      setData([newData, ...(data ?? [])]);
      console.log("Customer added successfully");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  }; 

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await importCSV(e.target.files[0]);
      await fetchData();
    }
  };
  */
