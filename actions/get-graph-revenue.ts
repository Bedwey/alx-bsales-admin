import { createClient } from "@/utils/supabase/server";

interface GraphData {
    name: string;
    total: number;
}

export const getGraphRevenue = async (storeId: string) => {
    const supabase = await createClient();

    const { data: paidOrders } = await supabase.from('orders').select('*, order_items(*, products(*))').match({ store_id: storeId, is_paid: true });

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of paidOrders!) {
        const month = new Date(order.created_at).getMonth();
        let revenueForOrder = 0;

        for (const item of order.order_items) {
            revenueForOrder += Number(item.products!.price);
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }


    const graphData: GraphData[] = [
        { name: 'January', total: monthlyRevenue[0] || 0, },
        { name: 'February', total: monthlyRevenue[1] || 0, },
        { name: 'March', total: monthlyRevenue[2] || 0, },
        { name: 'April', total: monthlyRevenue[3] || 0, },
        { name: 'May', total: monthlyRevenue[4] || 0, },
        { name: 'June', total: monthlyRevenue[5] || 0, },
        { name: 'July', total: monthlyRevenue[6] || 0, },
        { name: 'August', total: monthlyRevenue[7] || 0, },
        { name: 'September', total: monthlyRevenue[8] || 0, },
        { name: 'October', total: monthlyRevenue[9] || 0, },
        { name: 'November', total: monthlyRevenue[10] || 0, },
        { name: 'December', total: monthlyRevenue[11] || 0, },
    ];


    return graphData;
}
