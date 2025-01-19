import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderItem } from "@/lib/interfaces";

const subTotalPrice = (items: OrderItem[] | null): number => {
  if (!items || items.length === 0) return 0;

  const total = items.reduce((sum, item) => {
    return sum + item.article.price * item.quantity;
  }, 0);

  return total;
};

const shipping = (): number => {
  return 10;
};

const totalPrice = (items: OrderItem[] | null): number => {
  return subTotalPrice(items) + shipping();
};

export const OrderSummary = ({
  fetchedItems,
}: {
  fetchedItems: OrderItem[] | null;
}) => {
  return (
    <Card className="flex flex-col w-1/2 mt-8">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="w-full mx-auto mt-10 rounded-lg">
        <div className="flex justify-between mb-4">
          <span className="text-gray-700">Subtotal</span>
          <span className="text-gray-900">
            {subTotalPrice(fetchedItems).toFixed(2) + " €"}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700">Shipping</span>
          <span className="text-gray-900">{shipping() + " €"}</span>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="flex justify-between">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-gray-900">
            {totalPrice(fetchedItems).toFixed(2) + " €"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
