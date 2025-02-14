// orderTable.tsx
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { DataTableProps } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { StateKeys, useStore } from "@/lib/store";
import { Trash2, List, Terminal, Check } from "lucide-react";
import { deleteOrders } from "@/lib/services/orderServices";
import { useNavigate } from "react-router";

export function OrderTable<TData, TValue>({
  columns,
  data,
  showFilter = false,
  showSelect = false,
  showDelete = false,
  showPagination = false,
  showError = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [selectedOrders, setSelectedOrders] = useState<number[] | null>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { orderData, setState, notification } = useStore();
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  useEffect(() => {
    const selectedArticles = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.getValue("order_id") as number);

    setSelectedOrders(selectedArticles);
  }, [rowSelection]);

  const deleteRow = async (delete_ids: number[]) => {
    await deleteOrders(delete_ids);
    const new_data = orderData
      ? orderData.filter((order) => !delete_ids.includes(order.order_id))
      : null;
    setState(StateKeys.OrderData, new_data);
    setRowSelection({});
  };

  return (
    <div>
      <div className="flex items-center justify-between ">
        {/* Filter */}
        {showFilter && (
          <Input
            placeholder="Filter order id.."
            value={
              (table.getColumn("order_id")?.getFilterValue() as string) ?? ""
            }
            onChange={(event: any) =>
              table.getColumn("order_id")?.setFilterValue(event.target.value)
            }
            className="w-fit"
          />
        )}

        <div className="flex justify-center gap-2 pl-4 2xl:pl-0">
          {/* Deletion */}
          {showDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive_muted"}>
                  <Trash2 /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the the selected orders.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteRow(selectedOrders ?? [])}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Select */}
          {showSelect && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <List /> Selected Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const column_name =
                      column.id === "order_id" ? "Order ID" : column.id;
                    return (
                      <DropdownMenuCheckboxItem
                        key={column_name}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: any) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column_name}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-4 border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() =>
                    navigate(`/orders/${row.getValue("order_id")}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between py-4">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span>Previous</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span>Next</span>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      )}

      {/* Show Error */}
      {showError && (
        <AnimatePresence>
          {notification.error && (
            <motion.div
              className="fixed z-50 flex justify-end bottom-8 right-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Alert className="w-full" variant={"destructive"}>
                <Terminal className="w-4 h-4" />
                <AlertTitle>Error!</AlertTitle>

                <AlertDescription>
                  {(notification.error as any).response?.data.error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          {notification.success && (
            <motion.div
              className="fixed z-50 flex justify-end bottom-8 right-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Alert className="w-full" variant={"success"}>
                <Check className="w-4 h-4" />
                <AlertTitle>Success!</AlertTitle>

                <AlertDescription>{notification.success}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
