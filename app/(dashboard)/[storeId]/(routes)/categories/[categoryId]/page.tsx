import { createClient } from '@/utils/supabase/server';
import { CategoryForm } from './components/category-form';

async function BillboardPage({ params }: { params: { storeId: string, categoryId: string } }) {

    const supabase = await createClient();

    const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("id", params.categoryId).single();

    const { data: billboards } = await supabase.from("billboards").select("*").eq("store_id", params.storeId);

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <CategoryForm inialData={category} billboards={billboards || []} />
            </div>
        </div>
    )
}

export default BillboardPage