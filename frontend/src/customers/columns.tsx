// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Article } from "@/lib/interfaces";

export const columns: ColumnDef<Article>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "street",
    header: "Street",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "zip_code",
    header: "Zip-code",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
];
