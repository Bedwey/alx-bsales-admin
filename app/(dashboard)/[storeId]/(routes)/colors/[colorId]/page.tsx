import { createClient } from '@/utils/supabase/server';
import { ColorForm } from './components/color-form';

async function BillboardPage({ params }: { params: { storeId: string, colorId: string } }) {

    const supabase = await createClient();

    const { data: color } = await supabase
        .from("colors")
        .select("*")
        .eq("id", params.colorId).single();

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ColorForm inialData={color} />
            </div>
        </div>
    )
}

export default BillboardPage