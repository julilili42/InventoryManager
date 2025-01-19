// orders.tsx
import { Button } from "@/components/ui/button";
import { AddOrder } from "./addOrder";
import { OrderLog } from "./orderLog";
import { TableOrder } from "./page";
import { pdf_gen, pdfRequest } from "@/lib/services/importExportService";

export const Orders = () => {
  const test_article: pdfRequest = {
    article: {
      article_id: 1,
      name: "test",
      price: 1,
      manufacturer: "test",
      stock: 1,
      category: "small",
    },
    customer: {
      customer_id: 1,
      first_name: "Julian",
      last_name: "Jurcevic",
      email: "test",
      location: "Reutlingen",
      street: "Grüner Weg 26",
      zip_code: 72766,
    },
  };

  return (
    <div className="flex flex-col items-start h-full gap-8 px-10 mt-8 lg:flex-row">
      <div className="w-full lg:mt-18 lg:w-1/2">
        <AddOrder />
        <div className="flex items-center gap-8 mt-8">
          <OrderLog />
          <Button onClick={() => pdf_gen(test_article)}>
            Test Generierung
          </Button>
        </div>
      </div>
      <div className="w-full lg:mt-18 lg:w-1/2">
        <TableOrder />
      </div>
    </div>
  );
};
