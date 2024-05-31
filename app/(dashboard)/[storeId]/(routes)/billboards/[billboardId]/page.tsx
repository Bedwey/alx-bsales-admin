import { createClient } from '@/utils/supabase/server';
import React from 'react'
import { BillboardForm } from './components/billboard-form';

async function BillboardPage({ params }: { params: { billboardId: string } }) {

    const supabase = await createClient();
    const { data: billboard } = await supabase
        .from("billboards")
        .select("*")
        .eq("id", params.billboardId).single();

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <BillboardForm inialData={billboard} />
            </div>
        </div>
    )
}

export default BillboardPage