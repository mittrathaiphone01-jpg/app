'use client'
import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import { formathDateThai } from '@/lib/utils'
import { ApiSendLineType, ApiSendLineTypeDetail } from '@/type'
import { handleAxiosError } from '@/utils/api'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface propType {
    lineUserId: string
}
interface dataType {
    ApiSendLineType: ApiSendLineType
    ApiSendLineTypeDetail: ApiSendLineTypeDetail

}

const Relax = ({ lineUserId }: propType) => {

    const [dataBill, setDataBill] = useState<ApiSendLineType[]>([]);
    const [loading, setLoading] = useState(true);

    const handleFachDataBill = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/all/unpaid/bill`, {
                user_id: String(lineUserId)
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LINE_GO_API_TOKEN}`
                }
            })
            console.log(res.data);

            if (res.status === 200) {
                setDataBill(res.data)
                setLoading(false)
            }

        } catch (error) {
            const result = await handleAxiosError(error)
            // toast.error(result)
        }
    }

    const handlePay = async (invoice: string, installment_price: number, type: number, bill_id: number, bill_detail_id: number, product_name: string , payment_no:number | string, total_installments :number ) => {
        const index = `งวดที่ ${payment_no}/${total_installments} `

        const payload = {
            invoice,
            installment_price,
            type,
            bill_id,
            bill_detail_id,
            user_id: lineUserId,
            product_name,
            index

        };


        const response = await axios.post('/api/payment/generate-payment-token', payload);
        if (response.status === 200) {
            const token = response.data.token
            window.location.href = `/payment/${token}`
        }
    }

    useEffect(() => {
        if (lineUserId) {
            handleFachDataBill()
        }
    }, [lineUserId])
    return (
        <div className='my-6 mx-auto container  '>
            {loading ? (
                <h2 className='text-xl text-center'>กำลังโหลดข้อมูล .....</h2>
            ) : (
                <Card className='w-full text-center text-2xl text-dark-2 '>
                    <div className=''>
                        <h2 className='text-start '>บิลผ่อน</h2>
                    </div>
                    <div>
                        {dataBill?.map((item) => (
                            <div key={item.id} className='mt-6'>
                                <Card className='border border-gray-200 text-xl text-center md:text-start' >บิล : {item.invoice}</Card>
                                <div className='flex flex-wrap w-full gap-2  justify-center bg-gray-200 rounded-md p-4'>
                                    {item.data.map((itemList, index) => (
                                        <Card className='border border-gray-200' key={itemList.id}>
                                            <p className='text-xl text-gray-500'>งวดที่ {itemList.payment_no} / {item.total_installments}</p>
                                            <p className='mt-1 text-base'>กำหนดชำระ {formathDateThai(itemList.payment_date)} </p>
                                            <p className='mt-1 text-base'>ราคา {Number(itemList.installment_price).toLocaleString()} บาท</p>
                                            <Button disabled={index !== 0} label='ชำระเงิน' size="small" className={`h-10 text-base rounded-md w-full mt-2 ${index === 0 ? "" : "bg-gray-400"}`} 
                                            onClick={() => handlePay(item.invoice, itemList.installment_price, 1, item.id, itemList.id, item.product_name, itemList.payment_no, item.total_installments)} />
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}

export default Relax