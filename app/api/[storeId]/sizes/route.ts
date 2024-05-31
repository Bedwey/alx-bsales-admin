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

        const { data } = await supabase.from('sizes').select().eq('store_id', params.storeId);

        console.log('[SIZES-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[SIZES-GET]', error);

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

        const { name, value } = await req.json();
        const { data } = await supabase.from('sizes').insert([{ name, value, store_id: params.storeId }]);

        console.log('[SIZES-POST]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[SIZES-POST]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}