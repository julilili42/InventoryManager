// formCard.tsx
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
import { useForm, FieldValues, Path } from "react-hook-form";

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

export function FormCard<TFormValues extends FieldValues>({
  title,
  fields,
  onSubmit,
  onFileImport,
  submitLabel = "Submit",
}: FormCardProps<TFormValues>) {
  const { register, handleSubmit, reset } = useForm<TFormValues>();

  const handleFormSubmit = (data: TFormValues) => {
    onSubmit(data);
    reset();
  };

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
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  type={field.valueAsNumber ? "number" : "text"}
                  {...register(field.name, {
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
              <CirclePlus /> {submitLabel}
            </Button>

            {onFileImport && (
              <div className="flex flex-row gap-4 mt-5 md:mt-0">
                <Button
                  variant="secondary"
                  onClick={() => document.getElementById("fileInput1")?.click()}
                  className="w-fit"
                >
                  <Download /> Import
                </Button>
                <input
                  onChange={onFileImport}
                  type="file"
                  id="fileInput1"
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
