import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const { token } = await req.json();
        const data = jwt.verify(token, JWT_SECRET) as {
            payment_date: string,
            name: string,
            installment_price: number,
            invoice: string,
            type: number,
            user_id: string,
            product_name: string,
            iat: number,
            exp: number
            bill_id: number
            bill_detail_id: number
            index: string
        };

        return NextResponse.json({ data });

    } catch (error) {
        console.error('Error generating token:', error);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
}