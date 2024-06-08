"use client"

import { Database } from "@/utils/supabase/supabase"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

type ProductColumn = Database['public']['Tables']['products']['Row'] & { price_formated: string, category_name: string, color_name: string, color_value: string, size_name: string };

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "is_archived",
        header: "Is Archived",
    },
    {
        accessorKey: "is_featured",
        header: "Is Featured",
    },
    {
        accessorKey: "price_formated",
        header: "Price",
    },
    {
        accessorKey: "category_name",
        header: "category",
    },
    {
        accessorKey: "size_name",
        header: "Size",
    },
    {
        accessorKey: "color_id",
        header: "Color",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                {row.original.color_name}
                <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: row.original.color_value }}
                />

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
