import { format } from 'date-fns';
import { SizeClient } from './components/client'
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/utils/supabase/supabase';

type Size = Database['public']['Tables']['sizes']['Row'];

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
    const supabase = await createClient();

    const { data: sizes } = await supabase.from('sizes').select().eq('store_id', params.storeId) || [];

    const formattedSizes: Size[] = sizes?.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        store_id: item.store_id,
        created_at: format(item.created_at, 'MM/dd/yyyy'),
    })) || [];


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SizeClient
                    data={formattedSizes}
                />
            </div>
        </div>
    )
}

export default SizesPage;