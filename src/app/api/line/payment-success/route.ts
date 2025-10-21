import axios from 'axios';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// *** กรุณาเปลี่ยนค่าเหล่านี้ด้วยตัวแปร Environment Variables ของคุณ ***
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';
const JWT_SECRET = process.env.JWT_SECRET;

// DYNAMIC_RECEIPT_IMAGE_URL ไม่จำเป็นต้องใช้แล้วสำหรับการส่ง Flex Message โดยตรง
// const DYNAMIC_RECEIPT_IMAGE_URL = 'https://your-domain.com/receipts/success.jpg'; // ตัวอย่าง

/**
 * ฟังก์ชันสำหรับสร้าง Flex Message (ใบเสร็จรับเงิน)
 */
const createReceiptFlexMessage = (invoiceNumber: string, amount: number, userId: string, amountForBill: number, free_amount: number, total_installments: number, payment_no: string) => {
    // จัดรูปแบบจำนวนเงินให้มี comma
    const formattedAmount = Number(amount).toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    console.log({ formattedAmount });

    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined')
        return
    }
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });

    // โครงสร้าง Flex Message ที่ถูกออกแบบให้คล้ายใบเสร็จ
    return {
        type: "flex",
        altText: "ใบเสร็จรับเงินอิเล็กทรอนิกส์",
        contents: {
            type: "bubble",
            size: "kilo", // ขนาด bubble เล็ก
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "🧾 ใบเสร็จรับเงิน (E-Receipt)",
                        weight: "bold",
                        color: "#1DB446",
                        size: "sm",
                        align: "center"
                    },
                    {
                        type: "text",
                        text: "ชำระเงินสำเร็จแล้ว",
                        weight: "bold",
                        size: "xxl",
                        margin: "md",
                        align: "center",
                        color: "#1DB446"
                    }
                ]
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "box",
                        layout: "vertical",
                        margin: "lg",
                        spacing: "sm",
                        contents: [
                            // รายละเอียดบิล
                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "เลขที่บิล",
                                        size: "sm",
                                        color: "#555555",
                                        flex: 0
                                    },
                                    {
                                        type: "text",
                                        text: invoiceNumber,
                                        size: "sm",
                                        color: "#111111",
                                        align: "end"
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "งวดที่",
                                        size: "sm",
                                        color: "#555555",
                                        flex: 0
                                    },
                                    {
                                        type: "text",
                                        text: `${payment_no}/${total_installments}`,
                                        size: "sm",
                                        color: "#111111",
                                        align: "end"
                                    }
                                ]
                            },
                            // รายละเอียดจำนวนเงิน
                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "ค่างวด",
                                        size: "sm",
                                        color: "#555555",
                                        flex: 0
                                    },
                                    {
                                        type: "text",
                                        text: `${Number(amountForBill).toLocaleString()} บาท`,
                                        size: "sm",
                                        color: "#111111",
                                        align: "end",
                                        weight: "bold"
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "ค่าปรับ",
                                        size: "sm",
                                        color: "#555555",
                                        flex: 0
                                    },
                                    {
                                        type: "text",
                                        text: `${Number(free_amount).toLocaleString()} บาท`,
                                        size: "sm",
                                        color: "#111111",
                                        align: "end",
                                        weight: "bold"
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "จำนวนเงินที่ชำระ",
                                        size: "sm",
                                        color: "#555555",
                                        flex: 0
                                    },
                                    {
                                        type: "text",
                                        text: `${formattedAmount} บาท`,
                                        size: "sm",
                                        color: "#111111",
                                        align: "end",
                                        weight: "bold"
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        type: "separator",
                        margin: "xxl"
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        margin: "md",
                        contents: [
                            {
                                type: "text",
                                text: "สถานะ",
                                size: "sm",
                                color: "#555555"
                            },
                            {
                                type: "text",
                                text: "สำเร็จ",
                                size: "sm",
                                color: "#1DB446",
                                align: "end",
                                weight: "bold"
                            }
                        ]
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "spacer",
                        size: "md"
                    },
                    {
                        type: "button",
                        action: {
                            type: "uri",
                            label: "ดูรายละเอียดบัญชี",
                            uri: `${process.env.NEXTAUTH_URL}/my-pay?user_id=${token}`,
                        },
                        style: "primary",
                        color: "#00B900"
                    }
                ]
            }
        }
    };
};


/**
 * API สำหรับส่งใบเสร็จกลับไปยัง Line ลูกค้าหลังการชำระเงินสำเร็จ
 * @param request ข้อมูลการชำระเงิน
 * @returns สถานะการส่ง Line Message
 */
export async function POST(request: Request) {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
        console.error('LINE_CHANNEL_ACCESS_TOKEN is not defined');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        // Assume request.json() contains userId, invoiceNumber, amount
        const { bill_id, bill_detail_id, installment_price, user_id, type } = await request.json();

        let userId = user_id
        let invoiceNumber = ""
        let amountForBill = 0
        let amountAll = 0
        let free_amount = 0
        let total_installments = 0
        let payment_no = ""

        if (type === 1) {

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/paid/bill`, {
                bill_id: Number(bill_id),
                bill_detail_id: Number(bill_detail_id)
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.LINE_GO_API_TOKEN}`
                }
            })
            if (res.status === 200) {
                // console.log({ BILL_1: res.data[0] });
                // console.log({ BILL_1_DETAIL: res.data[0].data[0] });

                invoiceNumber = res.data[0].invoice || ""
                amountForBill = res.data[0].net_installment || 0
                free_amount = res.data[0].data[0].fee_amount || 0
                amountAll = res.data[0].data[0].installment_price || 0
                total_installments = res.data[0].total_installments
                payment_no = res.data[0].data[0].payment_no

            }

        } else if (type === 2) {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/paid/bill/in`, {
                bill_id: Number(bill_id),
                bill_detail_id: Number(bill_detail_id)
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.LINE_GO_API_TOKEN}`
                }
            })
            if (res.status === 200) {
                console.log({ BILL_2: res.data[0] });
                const priceForBill = res.data[0].fee_amount ? Number(res.data[0].bill_details[0].installment_price) - Number(res.data[0].fee_amount) : Number(res.data[0].bill_details[0].installment_price)
                console.log({ BILL_2_TEST: priceForBill });
                 console.log({ BILL_2_DETAIL: res.data[0].bill_details[0] });

                invoiceNumber = res.data[0].invoice || ""
                amountForBill = priceForBill || 0
                free_amount = res.data[0].bill_details[0].fee_amount || 0
                amountAll = res.data[0].bill_details[0].installment_price || 0
                total_installments = res.data[0].total_installments
                payment_no = res.data[0].bill_details[0].payment_no

            }
        }

        console.log({ amountForBill });
        console.log({ free_amount });
        console.log({ amountForBill });
        console.log({ amountAll });


        // 1. สร้าง Flex Message Payload
        const flexMessage = createReceiptFlexMessage(invoiceNumber, amountAll, userId, amountForBill, free_amount, total_installments, payment_no);

        // 2. สร้าง Payload สำหรับ Line Messaging API
        const messagePayload = {
            to: userId, // Line User ID ของลูกค้า
            messages: [
                flexMessage
            ],
        };

        // 3. เรียก Line Messaging API
        const lineResponse = await fetch(LINE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(messagePayload),
        });

        const lineData = await lineResponse.json();

        if (lineResponse.ok) {
            console.log('Successfully sent receipt Flex Message to Line user:', userId);
            return NextResponse.json({ message: 'Flex Receipt sent successfully', lineResponse: lineData });
        } else {
            console.error('Failed to send Line Flex message:', lineData);
            return NextResponse.json({ error: 'Failed to send Line Flex message', lineResponse: lineData }, { status: 500 });
        }

    } catch (error) {
        console.error('Error processing payment success:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}