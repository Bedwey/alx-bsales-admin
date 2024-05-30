import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { storeId: string }
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .match({ id: params.storeId, user_id: user?.id }).single();

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar />
        <div className="flex flex-col pl-16">
          <Navbar />
          {children}
        </div>
      </div>
    </>
  );
}
