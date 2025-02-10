// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/lib/interfaces";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { StateKeys, useStore } from "@/lib/store";
import { deleteCustomers } from "@/lib/services/customerServices";

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
        <div
          className="flex items-center gap-2 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="cursor-default"
          />
          <span className="font-semibold">#{id}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => {
      const first_name: string = row.getValue("first_name");
      return <span className="font-semibold">{first_name}</span>;
    },
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row }) => {
      const last_name: string = row.getValue("last_name");
      return <span className="font-semibold">{last_name}</span>;
    },
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer_id: number = row.getValue("customer_id");
      const customer_email: string | undefined = row.getValue("email");
      const { customerData, setState } = useStore();

      const deleteRow = async (delete_ids: number[]) => {
        await deleteCustomers(delete_ids);
        const new_data = customerData
          ? customerData.filter(
              (customer) => !delete_ids.includes(customer.customer_id)
            )
          : null;
        setState(StateKeys.CustomerData, new_data);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => deleteRow([customer_id])}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href={`mailto:${customer_email}`}>Contact via Email</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
