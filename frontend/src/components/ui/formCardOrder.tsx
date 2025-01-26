// formCard.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { CirclePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, FieldValues, Path, Controller } from "react-hook-form";
import { OrderSelection } from "@/orders/articleSelection/selection";
import { useStore } from "@/lib/store";
import { ArticleTable } from "@/articles/articleTable";
import { columns } from "@/orders/articleSelection/columns";
import {
  Article,
  DeliveryStatus,
  OrderItem,
  OrderType,
} from "@/lib/interfaces";

interface FormField<TFormValues extends FieldValues> {
  label: string;
  name: Path<TFormValues>;
  placeholder: string;
  valueAsNumber?: boolean;
  required?: boolean;
}

interface FormCardProps<TFormValues extends FieldValues> {
  title: string;
  fields: FormField<TFormValues>[];
  onSubmit: (values: TFormValues) => void;
  onFileImport?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitLabel?: string;
}

export function FormCardOrder<TFormValues extends FieldValues>({
  title,
  fields,
  onSubmit,
  submitLabel = "Submit",
}: FormCardProps<TFormValues>) {
  const { register, handleSubmit, reset, control } = useForm<TFormValues>({
    defaultValues: {
      status: "",
      order_type: "",
    } as any,
  });

  const handleFormSubmit = (data: TFormValues) => {
    onSubmit(data);
    reset();
  };

  const { selectedArticle } = useStore();

  const orderItems: OrderItem[] | null =
    selectedArticle?.selectedArticles.flatMap((item) =>
      item.article && item.quantity
        ? [{ article: item.article, quantity: item.quantity }]
        : []
    ) ?? null;

  const articles: Article[] | null =
    orderItems?.map((item) => item.article) ?? null;

  return (
    <Card className="mt-10 w-fit h-fit">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className="grid w-full max-w-sm items-center gap-1.5"
              >
                <Label htmlFor={field.name}>{field.label}</Label>

                {field.name === "status" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DeliveryStatus.Shipped}>
                            <Badge className="bg-blue-700">Shipped</Badge>
                          </SelectItem>
                          <SelectItem value={DeliveryStatus.Pending}>
                            <Badge className="bg-yellow-500">Pending</Badge>
                          </SelectItem>
                          <SelectItem value={DeliveryStatus.Completed}>
                            <Badge className="bg-green-700">Completed</Badge>
                          </SelectItem>
                          <SelectItem value={DeliveryStatus.Delivered}>
                            <Badge className="bg-teal-700">Delivered</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : field.name === "order_type" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Order Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={OrderType.Sale}>
                            <Badge className="bg-gray-500 rounded-xl">
                              Sale
                            </Badge>
                          </SelectItem>
                          <SelectItem value={OrderType.Return}>
                            <Badge className="bg-red-500 rounded-xl">
                              Return
                            </Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    type={field.valueAsNumber ? "number" : "text"}
                    {...register(field.name, {
                      valueAsNumber: field.valueAsNumber,
                      required: field.required,
                    })}
                  />
                )}
              </div>
            ))}
            <div className="w-full col-span-full">
              {selectedArticle ? (
                <>
                  <Label>Selected Articles</Label>
                  <ArticleTable
                    columns={columns}
                    data={articles ? articles : []}
                  />
                </>
              ) : (
                <OrderSelection />
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col justify-between w-full md:flex-row">
            <Button type="submit" className="w-fit">
              <CirclePlus /> {submitLabel}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
