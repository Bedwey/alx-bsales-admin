import { createClient } from "@/utils/supabase/server";

export const getStockCount = async (storeId: string) => {
    const supabase = await createClient();

    const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .match({ 'store_id': storeId, 'is_archived': false });

    return count || 0;
}
