'use client';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/utils/supabase/supabase";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ApiList } from "@/components/ui/api-list";

type Product = Database['public']['Tables']['products']['Row'] & { price_formated: string, category_name: string, color_name: string, color_value: string, size_name: string };


interface ProductClientProps {
    data: Product[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Products (${data.length})`}
                    description="Manage your products from your store."
                />

                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={columns}
                data={data}
            />
            <Heading
                title="API"
                description="API for products."
            />
            <Separator />
            <ApiList
                entityName="products"
                entityIdName="productId"
            />
        </>
    );
};