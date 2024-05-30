import StoreSwitcher from "@/components/store-switcher";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Navbar() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    const { data: stores } = await supabase.from("stores").select("*").eq("user_id", user.id);


    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores ?? []} />

                <div className="ml-auto flex items-center space-x-4">
                    User
                </div>
            </div>
        </div>
    )
}
