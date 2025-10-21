
import Card from '@/components/ui/Card'
import React from 'react'
import jwt from 'jsonwebtoken';
import { notFound } from 'next/navigation';
import SuccessPage from './SuccessPage';

const PagePayMentSuccess = async ({ params }: PageProps<'/payment/success/[slug]'>) => {

    const { slug } = await params;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined')
        return
    }

    // const data = jwt.verify(slug, JWT_SECRET);


    const data = jwt.verify(slug, JWT_SECRET) as {
        // payment_date: string,
        // name: string,
        installment_price: number,
        invoice: string,
        type: number,
        bill_id : number
        bill_detail_id : number
        user_id: string,
        // product_name: string,
        // iat: number,
        // exp: number
    };
    if (!data) {
        console.log('ไม่พบข้อมูลที่ส่งมา');
        return

    }
    console.log(data);

    return (
     <>
    {data ? (
         <SuccessPage data={data} token={slug}/>
    ): (
        <h2 className='text-xl'>กำลังโหลด.....</h2>
    )}
     </>
    )

}

export default PagePayMentSuccess
