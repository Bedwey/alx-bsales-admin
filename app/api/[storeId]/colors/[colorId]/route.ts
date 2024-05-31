import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
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

        const { data } = await supabase.from('colors').select().eq('id', params.colorId).single();

        console.log('[COLOR-GET]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[COLOR-GET]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {
        if (!params.storeId || !params.colorId) {
            return new NextResponse("Store ID and Color ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { name, value } = await req.json();
        const { data } = await supabase.from('colors').update({ name, value }).eq('id', params.colorId);

        console.log('[COLOR-PATCH]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[COLOR-PATCH]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {
        if (!params.storeId || !params.colorId) {
            return new NextResponse("Store ID and Color ID are required", { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { data } = await supabase.from('colors').delete().eq('id', params.colorId);

        console.log('[COLOR-DELETE]', data);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[COLOR-DELETE]', error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}