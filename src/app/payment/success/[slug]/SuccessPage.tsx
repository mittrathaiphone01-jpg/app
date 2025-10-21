'use client'
import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import { api, handleAxiosError } from '@/utils/api'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'

interface propType {
    data: {
        invoice: string
        installment_price: string | number
        type: number
        bill_id: number
        bill_detail_id: number
        user_id: string
    },
    token: string
}

const SuccessPage = ({ data: { invoice, installment_price, type, bill_id, bill_detail_id, user_id }, token }: propType) => {

    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("กำลังทำรายการ .....")

    const handleSavePay = async () => {

            const payload = {
                    bill_id: bill_id,
                    bill_detail_id,
                    amount: installment_price
                }
                console.log({handleSavePay : payload});
                
        try {
            console.log('xxxx');

            if (type === 1) {
                console.log('payment type = 1');

                const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/pay`, {
                    bill_id: bill_id,
                    bill_detail_id,
                    amount: installment_price
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LINE_GO_API_TOKEN}`
                    }
                })

                if (res.status === 200) {
                    setLoading(false)
                    setMessage('ทำรายการสำเร็จ')
                    sendBillToLine(bill_id, bill_detail_id, installment_price, user_id, type)
                }

            } else if (type === 2) {

                console.log('payment type = 2');
                const payload = {
                    bill_id: bill_id,
                    bill_detail_id,
                    amount: installment_price
                }
                console.log({payload});
                
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/pay/in`, payload , {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LINE_GO_API_TOKEN}`
                    }
                })

                if (res.status === 200) {
                    setLoading(false)
                    setMessage('ทำรายการสำเร็จ')
                    sendBillToLine(bill_id, bill_detail_id, installment_price, user_id, type)
                }
            }
        } catch (error) {
            const result = await handleAxiosError(error)
            // toast.error(result)
            setLoading(false)
            setMessage('คุณทำรายการไปแล้ว !')
        }
    }

    const sendBillToLine = async (bill_id: number, bill_detail_id: number, installment_price: string | number, user_id: string, type: number) => {
        try {
            const payload = {
                bill_id,
                bill_detail_id,
                installment_price,
                user_id,
                type
            };
            const response = await axios.post('/api/line/payment-success', payload);

            if (response.status === 200) {
                console.log(" ส่งใบเสร็จ Line Flex Message สำเร็จ!");
            } else {
                console.error(" เกิดข้อผิดพลาดในการส่ง Line Message:", response.data);
            }
        } catch (error) {
            console.log(error);

        }
    }


    useEffect(() => {
        console.log('11111');
        
        if (invoice && installment_price && type) {
            console.log('22222');
            handleSavePay()
        }
    }, [invoice, installment_price, type])

    return (
        <div className="flex justify-center items-center h-screen mx-4 ">
            <Card className="w-full md:w-1/3 text-center">
                {loading
                    ? (
                        <h2 className="text-xl font-semibold mb-4">{message}</h2>
                    )
                    : (
                        <div className='flex flex-col justify-center items-center gap-4'>
                            <FaCheckCircle color='green' size={60} />
                            <h2 className="text-xl font-semibold mb-4">{message}</h2>

                            <Link href={`/my-pay?user_id=${token}`}>
                                <Button label='กลับหน้ารายการทั้งหมด' />
                            </Link>
                        </div>

                    )}
            </Card>

        </div>
    )
}

export default SuccessPage