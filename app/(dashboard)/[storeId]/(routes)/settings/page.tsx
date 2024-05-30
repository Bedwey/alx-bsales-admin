import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settigns-form";

interface SettingsPageProps {
    params: {
        storeId: string;
    };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    const { data: store } = await supabase.from("stores").select("*").eq("id", params.storeId).single();

    if (!store) {
        redirect("/");
    }



    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm inialData={store} />
            </div>
        </div>
    );
}


export default SettingsPage;