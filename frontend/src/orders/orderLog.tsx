// orderLog.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const OrderLog = () => {
  return (
    <Card className="w-fit h-fit mt-14">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Recently added Orders
        </CardTitle>
      </CardHeader>

      <CardContent>...</CardContent>
      <CardFooter>...</CardFooter>
    </Card>
  );
};
