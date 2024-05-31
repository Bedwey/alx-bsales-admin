import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
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

        const { data } = await supabase.from('categories').select().eq('store_id', params.storeId).single();

        console.log('[CATEGORIES-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[CATEGORIES-GET]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        if (!params.storeId || !params.categoryId) {
            return new NextResponse("Store ID and Category ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { name, billboardId } = await req.json();
        const { data } = await supabase.from('categories').update({ name, billboard_id: billboardId }).eq('id', params.categoryId);

        console.log('[CATEGORIES-PATCH]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[CATEGORIES-PATCH]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        if (!params.storeId || !params.categoryId) {
            return new NextResponse("Store ID and Category ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { data } = await supabase.from('categories').delete().eq('id', params.categoryId);

        console.log('[CATEGORIES-DELETE]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[CATEGORIES-DELETE]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}