// articleTable.tsx
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableProps, ArticleSelection } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { StateKeys, useStore } from "@/lib/store";
import { Trash2, List } from "lucide-react";
import { deleteArticles } from "@/lib/services/articleService";

export function ArticleTable<TData extends { quantity?: number }, TValue>({
  columns,
  data,
  pageSize = 15,
  showFilter = false,
  showSelect = false,
  showDelete = false,
  showPagination = false,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [selectedArticles, setSelectedArticles] =
    useState<ArticleSelection | null>(null);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { articleData, setState } = useStore();

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
        pageSize,
      },
    },
  });

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().flatRows.map((row) => {
      const original = row.original;
      const article_id = row.getValue("article_id") as number;

      const selectedArticle = articleData
        ? articleData.find((article) => article.article_id === article_id)
        : null;

      return {
        article: selectedArticle,
        quantity: original.quantity ?? 0,
      };
    });

    setSelectedArticles({ selectedArticles: selectedRows });
    onSelectionChange?.({ selectedArticles: selectedRows });
  }, [rowSelection]);

  const deleteRow = async (delete_ids: number[]) => {
    await deleteArticles(delete_ids);
    const updatedData = articleData
      ? articleData.filter(
          (article) => !delete_ids.includes(article.article_id)
        )
      : null;
    setState(StateKeys.ArticleData, updatedData);
    setRowSelection({});
  };

  return (
    <div>
      {(showFilter || showDelete || showSelect) && (
        <div className="flex items-center justify-between mb-4">
          {/* Filter */}
          {showFilter && (
            <Input
              placeholder="Filter article id.."
              value={
                (table.getColumn("article_id")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event: any) =>
                table
                  .getColumn("article_id")
                  ?.setFilterValue(event.target.value)
              }
              className="w-fit"
            />
          )}

          <div className="flex justify-center gap-2 pl-4 2xl:pl-0">
            {/* Deletion */}
            {showDelete && (
              <Button
                variant={"destructive_muted"}
                onClick={() => {
                  const delete_ids =
                    selectedArticles?.selectedArticles.flatMap((item) =>
                      item.article ? [item.article.article_id] : []
                    ) ?? [];

                  deleteRow(delete_ids);
                }}
              >
                <Trash2 /> Delete
              </Button>
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
                        column.id === "article_id" ? "Article ID" : column.id;
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
      )}

      {/* Data Table */}
      <div className="border rounded-md">
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
    </div>
  );
}
