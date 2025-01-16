// interfaces.tsx
import { ColumnDef } from "@tanstack/react-table";
import { AxiosRequestConfig } from "axios";
import { FieldValues } from "react-hook-form";
export interface Request {
  route: string;
  body?: any;
  token?: string;
  responseType?: AxiosRequestConfig["responseType"];
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface Article extends FieldValues {
  article_id: number;
  price: number;
  stock: number;
  manufacturer: string;
  category: string;
}

export interface Customer extends FieldValues {
  customer_id: number;
  first_name: string;
  last_name: string;
  street: string;
  location: string;
  zip_code: number;
  email: string;
}

export interface Order extends FieldValues {
  order_id: number;
  customer: Customer;
  items: OrderItem[];
}

export interface OrderItem {
  article: Article;
  quantity: number;
}
