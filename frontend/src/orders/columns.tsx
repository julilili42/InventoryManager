// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/interfaces";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer } from "@/lib/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_id",
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
            Order ID
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const id = parseInt(row.getValue("order_id"));
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
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customer: Customer = row.getValue("customer");
      return (
        <div>
          <div className="font-semibold">
            {customer.first_name} {customer.last_name}
          </div>
          <small className="text-sm leading-none text-muted-foreground">
            {customer.email}
          </small>
        </div>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Location",
    cell: ({ row }) => {
      const customer: Customer = row.getValue("customer");
      return (
        <div>
          <div className="font-semibold">{customer.street}</div>
          <small className="text-sm leading-none text-muted-foreground">
            {customer.zip_code} {customer.location}
          </small>
        </div>
      );
    },
  },

  {
    accessorKey: "price",
    header: "Total Price",
    cell: ({ row }) => {
      const articles = row.getValue("article");
      if (!Array.isArray(articles)) {
        console.error("Invalid articles (not an array):", articles);
        return <div>Invalid articles</div>;
      }

      const totalPrice = articles.reduce((sum, item) => {
        if (Array.isArray(item) && item.length === 2) {
          const [article, quantity] = item;
          return sum + article.price * quantity;
        }
        return sum;
      }, 0);

      return <div>{totalPrice.toFixed(2)} €</div>;
    },
  },
  {
    accessorKey: "article",
    header: "Articles",
    cell: ({ row }) => {
      const articles = row.getValue("article");

      if (!Array.isArray(articles)) {
        console.error("Invalid articles (not an array):", articles);
        return <div>Invalid articles</div>;
      }

      return (
        <div>
          {articles.map((item, index) => {
            // item is array of length 2: [Article, Quantity]
            if (Array.isArray(item) && item.length === 2) {
              const [article, quantity] = item;
              return (
                <div key={index}>
                  <strong>Article ID:</strong> {article.article_id},<br />
                  <strong>Quantity:</strong> {quantity},<br />
                  <strong>Price:</strong> {article.price},<br />
                  <strong>Category:</strong> {article.category}
                </div>
              );
            }
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Order</DropdownMenuItem>
            <DropdownMenuItem>Download Receipt</DropdownMenuItem>
            <DropdownMenuItem>Contact via Email</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
