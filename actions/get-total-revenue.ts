import { createClient } from "@/utils/supabase/server";

export const getTotalRevenue = async (storeId: string) => {
    const supabase = await createClient();

    const { data: paidOrders } = await supabase.from('orders')
        .select('*, order_items(*, products(*))')
        .match({ store_id: storeId, is_paid: true });

    const totalRevenue = paidOrders!.reduce((total, order) => {
        const orderTotal = order.order_items.reduce((orderSum, item) => {
            return orderSum + Number(item.products!.price);
        }, 0);

        return total + orderTotal;
    }, 0);


    return totalRevenue;
}
