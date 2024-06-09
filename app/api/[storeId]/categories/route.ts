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

        const { data } = await supabase
            .from('categories')
            .select('*, billboards(*)')
            .eq('store_id', params.storeId)
            .order('created_at', { ascending: false });

        console.log('[CATEGORIES-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[CATEGORIES-GET]', error);

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

        const { name, billboard_id } = await req.json();
        const { data } = await supabase.from('categories').insert([{ name, billboard_id, store_id: params.storeId }]);

        console.log('[CATEGORIES-POST]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[CATEGORIES-POST]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}