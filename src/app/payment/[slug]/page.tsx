
//app/payment/[slug]/page.tsx
import React from 'react'
import jwt from 'jsonwebtoken';
import Paying from './Paying';
import { notFound } from 'next/navigation';



const JWT_SECRET = process.env.JWT_SECRET;


const PaymentPage = async ({ params }: PageProps<'/payment/[slug]'>) => {

    const { slug } = await params;
    console.log({ slug });

    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined')
        return
    }

    if (!slug) {
        console.log('no slug');
        return

    }



    // const data = jwt.verify(slug, JWT_SECRET);
    // console.log(data);

    try {
        const data = jwt.verify(slug, JWT_SECRET) as {
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
            index : string
        };

        return (
            <div>
                <Paying
                    payment_date={data.payment_date}
                    name={data.name}
                    installment_price={data.installment_price}
                    invoice={data.invoice}
                    type={data.type}
                    user_id={data.user_id}
                    product_name={data.product_name}
                    bill_id={data.bill_id}
                    bill_detail_id={data.bill_detail_id}
                    index={data.index}
                />
            </div>
        );
    } catch (error) {
        console.error('Invalid or expired payment link:', error);
        notFound();
    }
}

export default PaymentPage
