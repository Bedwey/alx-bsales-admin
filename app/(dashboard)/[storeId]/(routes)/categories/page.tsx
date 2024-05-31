import { format } from 'date-fns';
import { CategoryClient } from './components/client'
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/utils/supabase/supabase';

type Category = Database['public']['Tables']['categories']['Row'];

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
    const supabase = await createClient();

    const { data: categories } = await supabase.from('categories').select().eq('store_id', params.storeId) || [];

    const formattedCategories: Category[] = categories?.map((item) => ({
        id: item.id,
        name: item.name,
        store_id: item.store_id,
        billboard_id: item.billboard_id,
        created_at: format(item.created_at, 'MM/dd/yyyy'),
    })) || [];


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <CategoryClient
                    data={formattedCategories}
                />
            </div>
        </div>
    )
}

export default CategoriesPage;