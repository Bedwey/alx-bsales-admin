import { createClient } from '@/utils/supabase/server';
import { SizeForm } from './components/size-form';

async function BillboardPage({ params }: { params: { storeId: string, sizeId: string } }) {

    const supabase = await createClient();

    const { data: size } = await supabase
        .from("sizes")
        .select("*")
        .eq("id", params.sizeId).single();

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SizeForm inialData={size} />
            </div>
        </div>
    )
}

export default BillboardPage