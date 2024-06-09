import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/supabase";

type ProductType = Database['public']['Tables']['products']['Row'];

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
};

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    const { productIds } = await req.json();

    if (!productIds || productIds.length === 0) {
        return new NextResponse("Product IDs are required", { status: 400 });
    }

    const supabase = await createClient();
    const { data: products } = await supabase.from('products').select().in('id', productIds);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products?.forEach((product: ProductType) => {
        line_items.push({
            quantity: 1,
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price * 100,
            },
        });
    });

    const { data: orderData } = await supabase.from('orders').insert({
        store_id: params.storeId,
        is_paid: false,
    }).select().single();


    const orderItemsToInsert = products!.map((product) => ({
        product_id: product.id,
        order_id: orderData!.id,
    }));

    const { data: orderItemsData } = await supabase.from('order_items').insert(orderItemsToInsert);

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
        metadata: {
            order_id: orderData!.id,
        }
    });

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
};