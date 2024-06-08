"use client"

import { Database } from "@/utils/supabase/supabase"
import { ColumnDef } from "@tanstack/react-table"

type OrderColumn = Database['public']['Tables']['orders']['Row'] & { totalPrice: string, products: string };

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "products",
        header: "Products",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "totalPrice",
        header: "Total Price",
    },
    {
        accessorKey: "is_paid",
        header: "Paid",
    },

]
