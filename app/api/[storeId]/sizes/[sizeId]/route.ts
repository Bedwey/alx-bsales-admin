import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
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

        const { data } = await supabase.from('sizes').select().eq('id', params.sizeId).single();

        console.log('[SIZE-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[SIZE-GET]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        if (!params.storeId || !params.sizeId) {
            return new NextResponse("Store ID and Size ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { name, value } = await req.json();
        const { data } = await supabase.from('sizes').update({ name, value }).eq('id', params.sizeId);

        console.log('[SIZE-PATCH]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[SIZE-PATCH]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        if (!params.storeId || !params.sizeId) {
            return new NextResponse("Store ID and Size ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { data } = await supabase.from('sizes').delete().eq('id', params.sizeId);

        console.log('[SIZE-DELETE]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[SIZE-DELETE]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}