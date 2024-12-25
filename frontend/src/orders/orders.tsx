import { Button } from "@/components/ui/button";
import { pdf_gen } from "@/lib/operations";
import { AddOrder } from "./addOrder";
import { OrderLog } from "./orderLog";

export const Orders = () => {
  const test_article = {
    article_id: 1,
    price: 1,
    manufacturer: "test",
    stock: 1,
    category: "small",
  };

  return (
    <div>
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
      </div>
    </div>
  );
};
