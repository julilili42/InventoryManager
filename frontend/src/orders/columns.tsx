// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/interfaces";
import { Checkbox } from "@/components/ui/checkbox";
import { Article, Customer } from "@/lib/interfaces";

type ArticleWithQuantity = [Article, number];

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
          <strong>Customer ID:</strong> {customer.customer_id}, <br />
          <strong>First Name:</strong> {customer.first_name}, <br />
          <strong>Last Name:</strong> {customer.last_name}, <br />
          <strong>Street:</strong> {customer.street}, <br />
          <strong>Location:</strong> {customer.location}, <br />
          <strong>ZIP Code:</strong> {customer.zip_code}, <br />
          <strong>Email:</strong> {customer.email}
        </div>
      );
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
];
