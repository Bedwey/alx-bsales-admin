import { createClient } from "@/utils/supabase/server";

export const getSalesCount = async (storeId: string) => {
    const supabase = await createClient();

    const { count } = await supabase.from('orders').select('id', { count: 'exact' }).match({ store_id: storeId, is_paid: true });

    return count || 0;
}
