// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveryStatus, Order, OrderType } from "@/lib/interfaces";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/lib/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteOrders } from "@/lib/services/orderServices";
import { useEffect, useState } from "react";
import { getTotalPrice } from "@/lib/services/statisticService";
import { StateKeys, useStore } from "@/lib/store";
import { pdf_gen } from "@/lib/services/importExportService";

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
        <div
          className="flex items-center gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            onClick={(event) => event.stopPropagation()}
          />
          <span className="font-semibold">#{id}</span>
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
    accessorKey: "location",
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
    header: "Total",
    cell: ({ row }) => {
      const [totalPrice, setTotalPrice] = useState<number>(NaN);
      useEffect(() => {
        const fetchTotalPrice = async () => {
          const total_prices: { [key: number]: number } = await getTotalPrice();
          const order_id = row.getValue("order_id");
          setTotalPrice(total_prices[Number(order_id)]);
        };

        fetchTotalPrice();
      }, [row]);

      return <div>{totalPrice.toFixed(2)} €</div>;
    },
  },

  {
    accessorKey: "order_type",
    header: "Type",
    cell: ({ row }) => {
      const orderType = row.getValue("order_type");
      switch (orderType) {
        case OrderType.Sale:
          return <Badge className="bg-gray-500 rounded-xl ">Sale</Badge>;
        case OrderType.Return:
          return <Badge className="bg-red-500 rounded-xl">Return</Badge>;
      }
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: DeliveryStatus = row.getValue("status");
      switch (status) {
        case DeliveryStatus.Pending:
          return <Badge className="bg-yellow-500">Pending</Badge>;
        case DeliveryStatus.Completed:
          return <Badge className="bg-green-700">Completed</Badge>;
        case DeliveryStatus.Shipped:
          return <Badge className="bg-blue-700">Shipped</Badge>;
        case DeliveryStatus.Delivered:
          return <Badge className="bg-teal-700">Delivered</Badge>;
      }
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { orderData, setState } = useStore();

      const orderId: number = row.getValue("order_id");
      const order: Order | undefined = orderData?.find(
        (order) => order.order_id === orderId
      );
      const customerEmail: string | undefined = order?.customer.email;

      const deleteRow = async (delete_ids: number[]) => {
        await deleteOrders(delete_ids);
        const new_data = orderData
          ? orderData.filter((order) => !delete_ids.includes(order.order_id))
          : null;
        setState(StateKeys.OrderData, new_data);
      };

      const handleDownloadReceipt = () => {
        if (order) {
          pdf_gen(order);
        } else {
          console.error("Order nicht gefunden");
        }
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
            <DropdownMenuItem onClick={() => handleDownloadReceipt()}>
              Download Receipt
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href={`mailto:${customerEmail}`}>Contact via Email</a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteRow([orderId])}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
