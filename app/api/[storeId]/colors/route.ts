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
        const { data } = await supabase.from('colors').select().eq('store_id', params.storeId);

        console.log('[COLORS-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[COLORS-GET]', error);

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


        if (!name || !value) {
            return new NextResponse("Name and value are required", { status: 400 });
        }

        const { data } = await supabase.from('colors').insert([{ name, value, store_id: params.storeId }]);

        console.log('[COLORS-POST]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[COLORS-POST]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}