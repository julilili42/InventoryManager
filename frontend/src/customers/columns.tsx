// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/lib/interfaces";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "customer_id",
    header: ({ column, table }) => {
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Customer ID
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const id = parseInt(row.getValue("customer_id"));
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          {id}
        </div>
      );
    },
  },
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
