import { createClient } from '@/utils/supabase/server';
import React from 'react'
import { ProductForm } from './components/product-form';

async function ProductPage({ params }: { params: { productId: string, storeId: string } }) {

    const supabase = await createClient();
    const { data: product } = await supabase
        .from("products")
        .select('*, products_images(*)')
        .eq("id", params.productId).single();


    const { data: categories } = await supabase.from('categories').select('*').eq('store_id', params.storeId);
    const { data: colors } = await supabase.from('colors').select('*').eq('store_id', params.storeId);
    const { data: sizes } = await supabase.from('sizes').select('*').eq('store_id', params.storeId);


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductForm
                    inialData={product}
                    categories={categories || []}
                    colors={colors || []}
                    sizes={sizes || []}
                />
            </div>
        </div>
    )
}

export default ProductPage