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

type SizeColumn = Database['public']['Tables']['sizes']['Row'];


interface SizeClientProps {
    data: SizeColumn[];
}

export const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sizes (${data.length})`}
                    description="List of all sizes."
                />

                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
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
                description="API for sizes."
            />
            <Separator />
            <ApiList
                entityName="sizes"
                entityIdName="sizeId"
            />
        </>
    );
};