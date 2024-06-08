import { format } from 'date-fns';
import { OrderClient } from './components/client'
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/utils/supabase/supabase';
import { formater } from '@/lib/utils';

type Order = Database['public']['Tables']['orders']['Row'] & { totalPrice: string, products: string };

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
    const supabase = await createClient();

    const { data: orders } = await supabase
        .from('orders')
        .select('*, orders_items(*, products(*))')
        .eq('store_id', params.storeId) || [];

    const formattedOrders: Order[] = orders?.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        is_paid: item.is_paid,
        products: item.orders_items.map((ordersItem) => ordersItem.products[0].name).join(', '),
        totalPrice: formater.format(item.orders_items.reduce((total, item2) => { return total + Number(item2.products[0].price) }, 0)),
        created_at: format(item.created_at, 'MM/dd/yyyy'),
        store_id: item.store_id,
    })) || [];


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <OrderClient
                    data={formattedOrders}
                />
            </div>
        </div>
    )
}

export default OrdersPage;