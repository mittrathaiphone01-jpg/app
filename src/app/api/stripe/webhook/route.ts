import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil'
});

export async function POST(req: NextRequest) {
    const buf = await req.text();
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('Webhook secret is not set.');
        return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            buf,
            sig as string,
            webhookSecret as string
        ) as unknown as Stripe.Event;
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            console.log(`[Webhook] Checkout Session Completed! Session ID: ${session.id}`);
            // Initial status: payment_status: 'unpaid'
            // You can update your database here
            // For example: db.orders.updateOne({ sessionId: session.id }, { status: 'pending' });
            break;

        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
            console.log(`[Webhook] Payment Intent Succeeded! ID: ${paymentIntentSucceeded.id}`);
            // Status changes to: payment_status: 'paid'
            // Update database to confirm the payment
            // For example: db.orders.updateOne({ paymentIntentId: paymentIntentSucceeded.id }, { status: 'paid' });
            // Send a payment confirmation email or process the order
            break;

        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
            console.log(`[Webhook] Payment Intent Failed! ID: ${paymentIntentFailed.id}`);
            // Update database that the payment failed
            // For example: db.orders.updateOne({ paymentIntentId: paymentIntentFailed.id }, { status: 'failed' });
            break;

        default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}