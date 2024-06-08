import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);

        const categoryId = searchParams.get('categoryId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const isFeatured = searchParams.get('isFeatured') || undefined;

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        let query = supabase.from('products').select('*, products_images(*), categories(*), colors(*), sizes(*)')

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        if (colorId) {
            query = query.eq('color_id', colorId);
        }

        if (sizeId) {
            query = query.eq('size_id', sizeId);
        }

        if (isFeatured) {
            query = query.eq('is_featured', isFeatured);
        }

        const { data } = await query.order('created_at', { ascending: false });

        console.log('[PRODUCTS-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[PRODUCTS-GET]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const {
            name,
            price,
            category_id,
            color_id,
            size_id,
            is_featured,
            is_archived,
            products_images
        } = await req.json();


        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!category_id) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        if (!color_id) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        if (!size_id) {
            return new NextResponse("Size ID is required", { status: 400 });
        }

        if (!products_images || !products_images.length) {
            return new NextResponse("Product Images is required", { status: 400 });
        }

        const { data } = await supabase.from('products').insert([{
            name,
            price,
            category_id,
            color_id,
            size_id,
            is_featured,
            is_archived,
            store_id: params.storeId
        }]).select('*').single();

        const imagesToInsert = products_images.map((image: { url: string }) => ({
            url: image.url,
            product_id: data!.id
        }));

        const { data: ImagesData, error } = await supabase.from('products_images').insert(imagesToInsert);

        console.log('[PRODUCT-POST]', data);
        console.log('[PRODUCT-IMAGES-POST-ERROR]', error);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[PRODUCT-POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}