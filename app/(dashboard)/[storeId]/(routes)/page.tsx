import { createClient } from "@/utils/supabase/server";
import React from "react";

interface DashboardPageProps {
    params: { storeId: string; }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {

    const supabae = await createClient();
    const { data: store } = await supabae.from("stores").select("*").match({ id: params.storeId }).single();

    return (
        <div>
            Dashboard Page: {store?.name}
        </div>
    );
}

export default DashboardPage;