// card.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, CirclePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Article } from "../../lib/interfaces";
import { addEntry, importCSV } from "./operations";
import { useStore } from "@/lib/store";

export const AddArticle = () => {
  const { register, handleSubmit, reset } = useForm<Article>();
  const { data, setData, fetchData } = useStore();

  const onSubmit = async (newData: Article) => {
    try {
      await addEntry(newData);
      await fetchData();
      setData([newData, ...(data ?? [])]);
      console.log("Article added successfully");
      reset();
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  const fields = [
    {
      label: "Article ID",
      name: "article_id",
      placeholder: "Article ID",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Price",
      name: "price",
      placeholder: "Price",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Stock",
      name: "stock",
      placeholder: "Stock",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Manufacturer",
      name: "manufacturer",
      placeholder: "Manufacturer",
    },
    { label: "Category", name: "category", placeholder: "Category" },
  ];

  const handleFileInport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await importCSV(e.target.files[0]);
      await fetchData();
    }
  };

  return (
    <Card className="w-fit h-fit mt-14">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Add new article</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className="grid w-full max-w-sm items-center gap-1.5"
              >
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  type={field.valueAsNumber ? "number" : "text"}
                  {...register(field.name as keyof Article, {
                    valueAsNumber: field.valueAsNumber,
                    required: field.required,
                  })}
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col justify-between w-full md:flex-row">
            <Button type="submit" className="w-fit">
              <CirclePlus />
              Add article
            </Button>

            <div className="flex flex-row gap-4 mt-5 md:mt-0">
              <Button
                variant="secondary"
                onClick={() => document.getElementById("fileInput1")?.click()}
                className="w-fit"
              >
                <Download />
                Import
              </Button>
              <input
                onChange={handleFileInport}
                type="file"
                id="fileInput1"
                style={{ display: "none" }}
              />
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
