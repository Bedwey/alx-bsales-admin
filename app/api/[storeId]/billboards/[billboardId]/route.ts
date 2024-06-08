import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        if (!params.storeId || !params.billboardId) {
            return new NextResponse("Store ID and Billboard ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data } = await supabase.from('billboards').select().eq('id', params.billboardId).single();

        console.log('[BILLBOARDS-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[BILLBOARDS-GET]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        if (!params.storeId || !params.billboardId) {
            return new NextResponse("Store ID and Billboard ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { label, image_url } = await req.json();
        const { data } = await supabase.from('billboards').update({ label, image_url }).eq('id', params.billboardId);

        console.log('[BILLBOARDS-PATCH]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[BILLBOARDS-PATCH]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        if (!params.storeId || !params.billboardId) {
            return new NextResponse("Store ID and Billboard ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { data } = await supabase.from('billboards').delete().eq('id', params.billboardId);

        console.log('[BILLBOARDS-DELETE]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[BILLBOARDS-DELETE]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}