import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const body = await req.json();

        const { name } = body;

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const { data } = await supabase.from('stores').update({ name })
            .match({ id: params.storeId, user_id: user.id })
            .select().single();

        console.log('[STORES-PATCH]', data);


        return NextResponse.json(data);
    } catch (error) {
        console.log('[STORES-PATCH]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { data } = await supabase.from('stores').delete().match({ id: params.storeId, user_id: user.id });

        console.log('[STORES-DELETE]', data);

        return NextResponse.json(data);
    } catch (error) {
        console.log('[STORES-DELETE]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}