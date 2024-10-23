// TODO: 型定義が雑なので修正する
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  type Row,
} from '@tanstack/react-table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

import { type Player } from '@/app/football/_components/TeamList';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function PlayerTable({ data }: { data: Player[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Player>[] = [
    {
      accessorKey: 'name',
      header: '選手名',
    },
    {
      accessorKey: 'position',
      header: 'ポジション',
    },
    {
      accessorKey: 'dateOfBirth',
      header: '生年月日',
      cell: ({ row }: { row: Row<Player> }) => {
        const dateOfBirth = row.getValue('dateOfBirth') as string;
        const [year, month, day] = dateOfBirth.split('-');
        if (!year || !month || !day) return '-';

        return `${year}/${month}/${day}`;
      },
    },
    {
      accessorKey: 'nationality',
      header: '国籍',
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <Button
                        variant="ghost"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUp className="ml-2 h-4 w-4" />,
                          desc: <ArrowDown className="ml-2 h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </Button>
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
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
