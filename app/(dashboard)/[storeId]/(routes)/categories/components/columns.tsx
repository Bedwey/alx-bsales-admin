"use client"

import { Database } from "@/utils/supabase/supabase"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

type CategoryColumn = Database['public']['Tables']['categories']['Row'] | { billboard_label: string };

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: 'billboard_label',
        header: "Billboard",
    },
    {
        accessorKey: "created_at",
        header: "Date",
    },
    {
        accessorKey: "Actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    }
]
