'use client';

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/utils/supabase/supabase";
import { DataTable } from "./data-table";
import { columns } from "./columns";

type Order = Database['public']['Tables']['orders']['Row'] & { totalPrice: string, products: string };

interface OrderClientProps {
    data: Order[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {

    return (
        <>
            <Heading
                title={`Orders (${data.length})`}
                description="Manage your orders from your store."
            />
            <Separator />
            <DataTable
                columns={columns}
                data={data}
            />
        </>
    );
};