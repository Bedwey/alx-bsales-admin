import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

        const { data } = await supabase.from('stores').insert({
            name,
            user_id: user.id,
        }).select().single();

        console.log('[STORES-POST]', data);


        return NextResponse.json(data);
    } catch (error) {
        console.log('[STORES-POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}