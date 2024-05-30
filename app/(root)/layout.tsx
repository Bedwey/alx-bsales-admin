import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SetupLayout({
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
    .eq("user_id", user.id).limit(1).single();

  if (store) {
    redirect(`/${store.id}`);
  }

  return (
    <>
      {children}
    </>
  );
}
