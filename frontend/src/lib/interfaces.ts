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
  showFilter?: boolean;
  showSelect?: boolean;
  showDelete?: boolean;
  showPagination?: boolean;
}

export interface Article extends FieldValues {
  article_id: number;
  name: string;
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
  date: string;
  order_type: OrderType;
  status: DeliveryStatus;
}

export interface OrderItem {
  article: Article;
  quantity: number;
}

export enum DeliveryStatus {
  Pending = "Pending",
  Completed = "Completed",
  Shipped = "Shipped",
  Delivered = "Delivered",
}

export enum OrderType {
  Return = "Return",
  Sale = "Sale",
}
