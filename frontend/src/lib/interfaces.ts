// interfaces.tsx
import { ColumnDef } from "@tanstack/react-table";

export interface Request {
  route: string;
  body?: any;
  token?: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface Article {
  article_id: number;
  price: number;
  stock: number;
  manufacturer: string;
  category: "small" | "medium" | "large";
}
