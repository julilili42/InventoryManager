// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Article, OrderItem } from "@/lib/interfaces";

export const columns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: "article_id",
    header: "Article ID",
    cell: ({ row }) => {
      const article: Article = row.getValue("article");
      return article.article_id;
    },
  },
  {
    accessorKey: "article",
    header: "Article",
    cell: ({ row }) => {
      const article: Article = row.getValue("article");
      return article.name;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const article: Article = row.getValue("article");
      const price = article.price;
      return <div>{price.toFixed(2)} €</div>;
    },
  },
  {
    accessorKey: "total_price",
    header: "Total",
    cell: ({ row }) => {
      const article: Article = row.getValue("article");
      const quantity: number = row.getValue("quantity");
      const price: number = article.price;

      const totalPrice = price * quantity;

      return <div>{totalPrice.toFixed(2)} €</div>;
    },
  },
];
