'use client'
import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


interface PayingProps {
    payment_date: string,
    name: string,
    installment_price: number,
    invoice: string,
    type: number,
    user_id: string,
    product_name: string,
    bill_id: number
    bill_detail_id: number
    index : string
}


const Paying = ({ payment_date, name, installment_price, user_id, invoice, type, product_name, bill_id, bill_detail_id, index }: PayingProps) => {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');


    const handleCheckout = async () => {
        setLoading(true);
        const stripe = await stripePromise;

        const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: installment_price, currency: 'thb', user_id, name, type, product_name, invoice, bill_id, bill_detail_id, index }),
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

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
                <h1 className="text-2xl font-bold mb-4">ระบบชำระเงิน มิตรแท้ไอโฟน</h1>
                <p className="text-lg text-gray-700 ">เลขที่บิล : {invoice}</p>
                <p className="text-lg text-gray-700 ">{index}</p>
                <p className="text-lg text-gray-700 mb-6 mt-2">ยอดเงิน: {Number(installment_price).toLocaleString()} บาท</p>
                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {loading ? 'กำลังดำเนินการ...' : 'เริ่มชำระเงิน'}
                </button>
                <p className="mt-4 text-sm text-gray-500">
                    *กรุณาตรวจสอบยอดเงินให้ถูกต้องก่อนโอนเงิน
                </p>
            </div>
        </div>
    )
}

export default Paying