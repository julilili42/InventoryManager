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
  pageSize?: number;
  showFilter?: boolean;
  showSelect?: boolean;
  showDelete?: boolean;
  showPagination?: boolean;
  onSelectionChange?: (selectedItems: ArticleSelection) => void;
  onRowClick?: (customerId: number) => void;
  onQuantityChange?: (quantities: number[]) => void;
}

export interface Article extends FieldValues {
  article_id: number;
  name: string;
  price: number;
  stock: number;
  manufacturer: string;
  category: string;
  quantity?: number;
}

export interface ArticleSelection {
  selectedArticles: { article?: Article | null; quantity?: number | null }[];
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

export interface ArticleStatistics {
  ordered_quantities: { [key: number]: number };
  article_revenue: { [key: number]: number };
}

export interface OrderStatistics {
  total_prices: { [key: number]: number };
}

export interface CustomerStatistics {
  number_of_orders: { [key: number]: number };
  total_revenue: { [key: number]: number };
  most_bought_item: { [key: number]: number };
}

export interface Statistics {
  article_statistics: ArticleStatistics;
  order_statistics: OrderStatistics;
  customer_statistics: CustomerStatistics;
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
