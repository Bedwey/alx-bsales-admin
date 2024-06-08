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

        const { data } = await supabase.from('billboards').select().eq('store_id', params.storeId);

        console.log('[BILLBOARDS-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[BILLBOARDS-GET]', error);

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

        const { label, image_url } = await req.json();


        if (!label || !image_url) {
            return new NextResponse("Label and Image Url are required", { status: 400 });
        }

        const { data } = await supabase.from('billboards').insert([{ label, image_url, store_id: params.storeId }]);

        console.log('[BILLBOARDS-POST]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[BILLBOARDS-POST]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}