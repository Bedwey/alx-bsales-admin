"use client"

import { Database } from "@/utils/supabase/supabase"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

type ColorColumn = Database['public']['Tables']['colors']['Row'];

export const columns: ColumnDef<ColorColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "value",
        cell: ({ row }) => (
            <div
                className="flex items-center gap-x-4"
            >

                {row.original.value}
                <div className="border rounded-full w-5 h-5" style={{ backgroundColor: row.original.value }} />
            </div>
        ),
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
