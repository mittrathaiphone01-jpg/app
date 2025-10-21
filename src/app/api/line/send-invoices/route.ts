// app/api/send-invoices/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { ApiSendLineType, ApiSendLineTypeDetail } from '@/type';
import { formathDateThai } from '@/lib/utils';
import jwt from 'jsonwebtoken';


// ข้อมูล Line Messaging API
const LINE_MESSAGING_API_URL = 'https://api.line.me/v2/bot/message/push';
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;


const replyToUser = async (user_id: string, payment_date: string, name: string, installment_price: number, invoice: string, type: 1 | 2, product_name: string, bill_id: number, bill_detail_id: number, fee_amount: number, paid_installments: number, total_installments: number, payment_no: string) => {

    const newDate = formathDateThai(payment_date || "")
    const index = `งวดที่ ${payment_no}/${total_installments} `

    const payload = {
        payment_date,
        name,
        installment_price,
        invoice,
        type,
        user_id,
        product_name,
        bill_id,
        bill_detail_id,
        fee_amount,
        index
    };
    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined')
        return
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    const priceForBill = fee_amount ? Number(installment_price) - Number(fee_amount) : Number(installment_price)

    const messagePayload = {
        to: user_id,
        // messages: [
        //     {
        //         type: "template",
        //         altText: "บิลเก็บเงิน-มิตรแท้ไอโฟน",
        //         template: {
        //             type: "buttons",
        //             thumbnailImageUrl: "https://mittrathaiphone.com/wp-content/uploads/2025/08/logo.jpg",
        //             imageAspectRatio: "rectangle",
        //             imageSize: "cover",
        //             imageBackgroundColor: "#FFFFFF",
        //             title: `บิล ${invoice}`,
        //             text: ` เรียน ${name} ยอดเงิน ${Number(installment_price).toLocaleString()} บาท กำหนด ${newDate}`,
        //             actions: [
        //                 {
        //                     type: "uri",
        //                     label: `ชำระเงิน `,
        //                     uri: `${process.env.NEXTAUTH_URL}/payment/${token}`,
        //                 },
        //                 {
        //                     type: "uri",
        //                     label: "ติดต่อสอบถาม",
        //                     uri: "https://mittrathaiphone.com/",
        //                 },
        //             ],
        //         },
        //     },
        // ],

        messages: [
            {
                type: "flex",
                //altText: "บิลเก็บเงิน-มิตรแท้ไอโฟน",
                altText: "บิลเก็บเงิน",
                contents: {
                    type: "bubble",
                    body: {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "image",
                                url: "https://mittrathaiphone.com/wp-content/uploads/2025/08/logo.jpg",
                                size: "lg",
                                aspectRatio: "2:1",
                                aspectMode: "cover",
                            },
                            {
                                type: "text",
                                text: `${invoice}`,
                                weight: "bold",
                                size: "xl",
                            },
                            {
                                type: "text",
                                text: `เรียน ${name}`,
                                size: "sm",
                                color: "#555555",
                                margin: "md",
                            },
                            {
                                type: "separator",
                                margin: "md",
                            },
                            {
                                type: "box",
                                layout: "vertical",
                                margin: "md",
                                spacing: "sm",
                                contents: [
                                    {
                                        type: "box",
                                        layout: "baseline",
                                        spacing: "sm",
                                        contents: [
                                            { type: "text", text: "งวดที่", color: "#aaaaaa", size: "sm", flex: 2 },
                                            {
                                                type: "text",
                                                text: `${payment_no}/${total_installments} `,
                                                wrap: true, size: "sm", flex: 5
                                            },
                                        ],
                                    },
                                    {
                                        type: "box",
                                        layout: "baseline",
                                        spacing: "sm",
                                        contents: [
                                            { type: "text", text: "ค่างวด", color: "#aaaaaa", size: "sm", flex: 2 },
                                            {
                                                type: "text",
                                                text: `${Number(priceForBill).toLocaleString()} บาท`,
                                                wrap: true, size: "sm", flex: 5
                                            },
                                        ],
                                    },
                                    {
                                        type: "box",
                                        layout: "baseline",
                                        spacing: "sm",
                                        contents: [
                                            { type: "text", text: "ค่าปรับ", color: "#aaaaaa", size: "sm", flex: 2 },
                                            { type: "text", text: `${Number(fee_amount).toLocaleString()} บาท`, wrap: true, size: "sm", flex: 5 },
                                        ],
                                    },
                                    {
                                        type: "box",
                                        layout: "baseline",
                                        spacing: "sm",
                                        contents: [
                                            { type: "text", text: "ราคาสุทธิ", color: "#aaaaaa", size: "sm", flex: 2 },
                                            { type: "text", text: `${Number(installment_price).toLocaleString()} บาท`, wrap: true, size: "sm", flex: 5 },
                                        ],
                                    },
                                    {
                                        type: "box",
                                        layout: "baseline",
                                        spacing: "sm",
                                        contents: [
                                            { type: "text", text: "กำหนดชำระ", color: "#aaaaaa", size: "sm", flex: 2 },
                                            { type: "text", text: `${newDate}`, wrap: true, size: "sm", flex: 5 },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    footer: {
                        type: "box",
                        layout: "vertical",
                        spacing: "sm",
                        contents: [
                            {
                                type: "button",
                                style: "primary",
                                color: "#00B900",
                                action: {
                                    type: "uri",
                                    label: "ชำระเงิน",
                                    uri: `${process.env.NEXTAUTH_URL}/payment/${token}`,
                                },
                            },
                            {
                                type: "button",
                                style: "secondary",
                                action: {
                                    type: "uri",
                                    label: "ติดต่อสอบถาม",
                                    uri: "https://mittrathaiphone.com/",
                                },
                            },
                        ],
                    },
                },
            },
        ]


    };

    // 4. ส่งข้อความไปที่ Line Messaging API
    await axios.post(
        LINE_MESSAGING_API_URL,
        messagePayload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
        }
    );
};


export async function GET(request: NextRequest) {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
        return NextResponse.json(
            { success: false, error: 'LINE_CHANNEL_ACCESS_TOKEN is not set' },
            { status: 500 }
        );
    }

    try {
        const webappResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/unpaid/today`, {
            headers: {
                'Authorization': `Bearer ${process.env.LINE_GO_API_TOKEN}`
            }
        })

        if (webappResponse.status === 200) {

            if (webappResponse?.data?.results?.due_today?.length > 0) {
                await Promise.all(
                    webappResponse.data.results.due_today.map(async (item: ApiSendLineTypeDetail, index: number) => {

                        const payment_date = item.payment_date

                        await Promise.all(
                            item.data.map(async (itemList: ApiSendLineType) => {
                                const user_id = itemList.member_user_id
                                const name = itemList.member_full_name
                                if (user_id) {
                                    await replyToUser(user_id, payment_date, name, item.installment_price, itemList.invoice, 1, itemList.product_name, itemList.id, item.id, item.fee_amount, itemList.paid_installments, itemList.total_installments, item.payment_no)
                                }
                            })
                        )
                    })
                )
            }

            if (webappResponse?.data?.results?.overdue?.length > 0) {
                await Promise.all(
                    webappResponse.data.results.overdue.map(async (item: ApiSendLineTypeDetail, index: number) => {
                        const payment_date = item.payment_date

                        await Promise.all(
                            item.data.map(async (itemList: ApiSendLineType) => {
                                const user_id = itemList.member_user_id
                                const name = itemList.member_full_name
                                if (user_id) {
                                    await replyToUser(user_id, payment_date, name, item.installment_price, itemList.invoice, 1, itemList.product_name, itemList.id, item.id, item.fee_amount, itemList.paid_installments, itemList.total_installments, item.payment_no)
                                }
                            })
                        )

                    })
                )
            }

        }

        const webappResponse2 = await axios.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/unpaid/today/in`, {
            headers: {
                'Authorization': `Bearer ${process.env.LINE_GO_API_TOKEN}`
            }
        })


        if (webappResponse2?.data?.results?.due_today?.length > 0) {
            await Promise.all(
                webappResponse2.data.results.due_today.map(async (item: ApiSendLineTypeDetail, index: number) => {
                    const payment_date = item.payment_date


                    await Promise.all(
                        item.data.map(async (itemList: ApiSendLineType) => {
                            const user_id = itemList.member_user_id
                            const name = itemList.member_full_name
                            if (user_id) {
                                await replyToUser(user_id, payment_date, name, item.installment_price, itemList.invoice, 2, itemList.product_name, itemList.id, item.id, item.fee_amount, itemList.paid_installments, itemList.total_installments, item.payment_no)
                            }
                        })
                    )

                })
            )
        }

        if (webappResponse2?.data?.results?.overdue?.length > 0) {
            await Promise.all(
                webappResponse2.data.results.overdue.map(async (item: ApiSendLineTypeDetail, index: number) => {
                    const payment_date = item.payment_date

                    await Promise.all(
                        item.data.map(async (itemList: ApiSendLineType) => {
                            const user_id = itemList.member_user_id
                            const name = itemList.member_full_name
                            await replyToUser(user_id, payment_date, name, item.installment_price, itemList.invoice, 2, itemList.product_name, itemList.id, item.id, item.fee_amount, itemList.paid_installments, itemList.total_installments, item.payment_no)
                        })
                    )

                })
            )
        }



        return NextResponse.json({ success: true, message: 'ส่งบิลสำเร็จ' });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดใน Next.js API:', error);
        return NextResponse.json(
            { success: false, error: 'ส่งบิลล้มเหลว' },
            { status: 500 }
        );
    }
}