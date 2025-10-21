import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const payload = await req.json();
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        return NextResponse.json({ token });

    } catch (error) {
        console.error('Error generating token:', error);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
}