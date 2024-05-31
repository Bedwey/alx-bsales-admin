"use client"

import { Database } from "@/utils/supabase/supabase"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

type BillboardColumn = Database['public']['Tables']['billboards']['Row'];

export const columns: ColumnDef<BillboardColumn>[] = [
    {
        accessorKey: "label",
        header: "Label",
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
