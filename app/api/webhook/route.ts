import Stripe from "stripe";
import { headers } from 'next/headers';
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe"
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(', ');

    if (event.type === 'checkout.session.completed') {
        const supabase = await createClient();

        const { data } = await supabase.from('orders').update({
            is_paid: true,
            address: addressString,
            phone: session.customer_details?.phone || '',
        }).eq('id', session.metadata?.order_id || '');


        const { data: orderItems } = await supabase.from('order_items').select('*').eq('order_id', session.metadata?.order_id || '');
        await supabase.from('products').update({ is_archived: true }).in('id', orderItems?.map((item) => item.product_id) || []);
    }

    return new NextResponse(null, { status: 200 });
}