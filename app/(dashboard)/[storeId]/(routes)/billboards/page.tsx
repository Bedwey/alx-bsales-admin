import { format } from 'date-fns';
import { BillboardClient } from './components/client'
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/utils/supabase/supabase';

type Billboard = Database['public']['Tables']['billboards']['Row'];

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
    const supabase = await createClient();

    const { data: billboards } = await supabase.from('billboards').select().eq('store_id', params.storeId) || [];

    const formattedBillboards: Billboard[] = billboards?.map((item) => ({
        id: item.id,
        label: item.label,
        created_at: format(item.created_at, 'MM/dd/yyyy'),
        image_url: item.image_url,
        store_id: item.store_id,
    })) || [];


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <BillboardClient
                    data={formattedBillboards}
                />
            </div>
        </div>
    )
}

export default BillboardsPage;