


import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code not provided' }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', 'https://app-scgp.thaibusinessmate.com/check-user/success');
  params.append('client_id', String(process.env.NEXT_PUBLIC_LINE_CLIENT_ID)); 
  params.append('client_secret', String(process.env.NEXT_PUBLIC_LINE_CLIENT_SECRET)); 

  try {
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const data = await tokenResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}