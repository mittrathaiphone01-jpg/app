'use client'
import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


const PayPage = () => {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleCheckout = async () => {
        setLoading(true);
        const stripe = await stripePromise;

        // เรียก API เพื่อสร้าง Payment Intent
        const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: 1000, currency: 'thb' }), // สมมติว่ายอดเงิน 10 บาท
        });

        const data = await response.json();
        if (stripe && data.sessionId) {
            // ย้ายผู้ใช้ไปยัง Stripe Checkout
            const { error } = await stripe.redirectToCheckout({
                sessionId: data.sessionId,
            });

            if (error) {
                console.error('Stripe redirect failed:', error);
            }
        }
        setLoading(false);
    };


    return (
        <div>

            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
                    <h1 className="text-2xl font-bold mb-4">ชำระเงินทดสอบ</h1>
                    <p className="text-lg text-gray-700 mb-6">ยอดเงิน: 10.00 บาท</p>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {loading ? 'กำลังดำเนินการ...' : 'เริ่มชำระเงิน'}
                    </button>
                    <p className="mt-4 text-sm text-gray-500">
                        *การชำระเงินจะถูกจำลองเป็นสถานะ Pending เพื่อแสดงการทำงานของ Webhook
                    </p>
                </div>
            </div>

        </div>
    )
}

export default PayPage