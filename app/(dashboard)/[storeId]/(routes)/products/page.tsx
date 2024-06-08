import { format } from 'date-fns';
import { ProductClient } from './components/client'
import { createClient } from '@/utils/supabase/server';
import { Database } from '@/utils/supabase/supabase';
import { formater } from '@/lib/utils';

type Product = Database['public']['Tables']['products']['Row'] & { price_formated: string, category_name: string, color_name: string, color_value: string, size_name: string };

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
    const supabase = await createClient();

    const { data: products } = await supabase.from('products').select('*, categories(name), sizes(name), colors(name, value)').eq('store_id', params.storeId) || [];

    const formattedProducts: Product[] = products!.map((item) => ({
        id: item.id,
        name: item.name,
        created_at: format(item.created_at, 'MM/dd/yyyy'),
        price: item.price,
        price_formated: formater.format(item.price),
        category_id: item.category_id,
        category_name: item.categories?.name || "",
        color_id: item.color_id,
        color_name: item.colors?.name || "",
        color_value: item.colors?.value || "",
        is_archived: item.is_archived,
        size_id: item.size_id,
        size_name: item.sizes?.name || "",
        is_featured: item.is_featured,
        store_id: item.store_id,
    }));


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductClient
                    data={formattedProducts}
                />
            </div>
        </div>
    )
}

export default ProductsPage;