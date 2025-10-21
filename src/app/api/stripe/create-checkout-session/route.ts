import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil'

});
const JWT_SECRET = process.env.JWT_SECRET;


export async function POST(req: NextRequest) {
    try {
        const { amount, currency, user_id, name, type, product_name, invoice, bill_id, bill_detail_id, index } = await req.json();

        const payload = {
            invoice,
            installment_price : amount,
            type, 
            bill_id , 
            bill_detail_id , 
            user_id
        };

        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not defined')
            return
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        // สร้าง Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['promptpay'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: `${product_name} (${invoice}) - ${index}`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email : process.env.STRIPE_EMAIL,
            customer_creation: 'always',
            success_url: `${req.headers.get('origin')}/payment/success/${token}`,
            cancel_url: `${req.headers.get('origin')}/payment/cancel`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}