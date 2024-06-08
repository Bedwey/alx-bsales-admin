import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        if (!params.storeId || !params.productId) {
            return new NextResponse("Store ID and Product ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data } = await supabase
            .from('products')
            .select('*, products_images(*), categories(*), colors(*), sizes(*)')
            .eq('id', params.productId)
            .single();

        console.log('[PRODUCT-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[PRODUCT-GET]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        if (!params.storeId || !params.productId) {
            return new NextResponse("Store ID and Product ID are required", { status: 400 });
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

        const { data } = await supabase.from('products').update({
            name,
            price,
            category_id,
            color_id,
            size_id,
            is_featured,
            is_archived,
            store_id: params.storeId
        }).eq('id', params.productId);

        console.log('[PRODUCT-PATCH]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[PRODUCT-PATCH]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        if (!params.storeId || !params.productId) {
            return new NextResponse("Store ID and Product ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { data } = await supabase.from('products').delete().eq('id', params.productId);

        console.log('[PRODUCT-DELETE]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[PRODUCT-DELETE]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}