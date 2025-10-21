'use client'
import { Button } from '@/components/ui-elements/button';
import Card from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertConfirm, AlertConfirmInputText, formathDateThai } from '@/lib/utils';
import { DetailType, HeaderType } from '@/type';
import { api, handleAxiosError } from '@/utils/api';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoMdPrint } from 'react-icons/io';

import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const SelectReact = dynamic(() => import("react-select"), { ssr: false });

interface BlogPageProps {
    params: Promise<{
        slug: string;
    }>;
}


const MemberRentDetail = ({ params }: BlogPageProps) => {
    const { slug } = React.use<{ slug: string }>(params);
    const { data: session, status } = useSession()
    const router = useRouter()

    const [selectDown, setSelectDown] = useState("")
    const [selectIn, setSelectIn] = useState("")
    const [sum, setSum] = useState(0)
    const [selectAddPercen, setSelectAddPercen] = useState(0)

    const [dataHeader, setDataHeader] = useState<HeaderType | null>(null)
    const [dataDetail, setDataDetail] = useState<DetailType[]>([])

    // cal
    const downCal = (Number(dataHeader?.total_price) * Number(dataHeader?.down_percent)) / 100
    const debtCal = Number(dataHeader?.total_price) - Number(downCal)
    const sunCal = downCal + debtCal + Number(dataHeader?.fee_amount)


    // Show Data Nobile
    const [productNewPrice, setProductNewPrice] = useState(0)
    const [billData, setBillData] = useState<any>(null);

    const fetchDataHeaderById = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/${slug}`)
            if (res.status === 200) {
                console.log(res.data.data);
                setDataHeader(res.data.data)
            }
        } catch (error) {
            const resultt = await handleAxiosError(error)
            toast.error(resultt)
        }
    }

    const fetchDataDetail = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/all/detail/${slug}`)
            console.log(res.data.data);

            if (res.status === 200) {
                setDataDetail(res.data.data)
            }
        } catch (error) {
            const resultt = await handleAxiosError(error)
            toast.error(resultt)
        }
    }


    const handleCancelBill = async () => {
        try {
            const alertResult = await AlertConfirmInputText()

            if (!alertResult) return false

            console.log(alertResult);

            const res = await api.put(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/${slug}`, { status: 0, note: alertResult })

            if (res.status === 200) {
                window.location.reload();

            }

        } catch (error) {
            const resultt = await handleAxiosError(error)
            toast.error(resultt)
        }
    }

    const handlePrint = useCallback(async (bill_id: number, bill_detail_id: number, status: number) => {
        try {
            const loadingToast = toast.loading('กำลังโหลด ....')

            if (!bill_id && !bill_detail_id && !status) {
                toast.dismiss(loadingToast)
                toast.error('ส่งข้อมูลไม่ครบ')
                return
            }
            if (status !== 1) {

                toast.dismiss(loadingToast)
                toast.error('ยังไม่ชำระเงิน กรุณาชำระเงินก่อน')
                return
            }
            const payload = { bill_id, bill_detail_id, type: 1 }
            console.log(payload);

            const res = await axios.post(`/api/pdf/receipt`, { payload }, {
                responseType: 'blob',
            })

            if (res.status === 200) {
                toast.dismiss(loadingToast)

                const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
            }

        } catch (error) {
            console.log(error);

        }
    }, [])

    useEffect(() => {
        if (status !== "authenticated") {
            console.log('no session');
            return
        }
        if (slug) {
            fetchDataHeaderById()
            fetchDataDetail()
        }
    }, [slug, session, status])


    return (
        <div className='flex flex-col md:flex-row gap-4'>

            <div className='w-full md:w-9/12 h-full'>

                <Card >
                    <div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
                        <h3 className='text-xl'>ข้อมูลบิล <span className='text-dark-2 dark:text-dark-8'> {dataHeader?.invoice}</span></h3>
                        <p>สถานะ {dataHeader?.status === 1 ? "กำลังจ่าย" : dataHeader?.status === 0 ? "ยกเลิกบิล" : ""}</p>
                    </div>

                    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-4 mt-4   ">
                        <div className=' overflow-y-auto'>
                            <Table className='  '>
                                <TableHeader>
                                    <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white text-center">
                                        <TableHead className='text-center' >งวดที่</TableHead>
                                        <TableHead className='text-center'>ราคาต่องวด</TableHead>
                                        <TableHead className='text-center'>ค่าปรับ</TableHead>
                                        <TableHead className='text-center'>จ่ายเกิน</TableHead>
                                        <TableHead className='text-center'>รวมเป็น</TableHead>
                                        <TableHead className='text-center'>กำหนดชำระเงิน</TableHead>
                                        <TableHead className='text-center'>สถานะ</TableHead>
                                        <TableHead className='text-center'>ใบเสร็จ</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {dataDetail?.map((item, index) => {
                                        const sumCal = Number(item.installment_price) - Number(item.fee_amount)
                                        return (
                                            <TableRow key={item.id} className="border-[#eee] dark:border-dark-3 text-center">

                                                <TableCell className="min-w-[80px] ">
                                                    <p className="text-dark dark:text-white">{item.payment_no}/{dataDetail.length}</p>
                                                </TableCell>
                                                <TableCell className="min-w-[120px]  text-center">
                                                    <p className="text-dark dark:text-white">
                                                        {
                                                            item.fee_amount ? Number(sumCal).toLocaleString() : Number(item.installment_price).toLocaleString() || "-"
                                                        }
                                                    </p>
                                                </TableCell>

                                                <TableCell className="min-w-[100px]  text-center">
                                                    <p className="text-dark dark:text-white">{Number(item.fee_amount).toLocaleString() || "-"}</p>
                                                </TableCell>

                                                <TableCell className="min-w-[100px]  text-center">
                                                    <p className="text-dark dark:text-white">{Number(item.credit_balance).toLocaleString() || "-"}</p>
                                                </TableCell>


                                                <TableCell className="min-w-[120px]  text-center">
                                                    <p className="text-dark dark:text-white">{Number(item.installment_price).toLocaleString() || "-"}</p>
                                                </TableCell>

                                                <TableCell className="min-w-[120px]  text-center">
                                                    <p className="text-dark dark:text-white">{formathDateThai(item.payment_date) || "-"}</p>
                                                </TableCell>


                                                <TableCell className="min-w-[100px] text-center">
                                                    <p className={`text-dark dark:text-white ${item?.status === 0 ? "bg-red-200" : item?.status === 1 ? "bg-green-200" : ""} rounded-sm `}>
                                                        {item?.status === 0 ? "ยังไม่จ่าย" : item?.status === 1 ? "จ่ายแล้ว" : "-"}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="min-w-[100px] xl:pl-7.5 flex justify-center">
                                                    <button onClick={() => handlePrint(Number(dataHeader?.id), item.id, item.status)}>
                                                        <IoMdPrint size={25} />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row gap-2  md:gap-4 justify-end mt-4 md:mt-5'>
                        <Link href='/member/rent'> <Button label='ย้อนกลับ' variant="outlinePrimary" shape="rounded" className='h-10 w-full ' /></Link>

                        {session?.user.role_id === 1 && (
                            <Button label='ยกเลิกบิล' disabled={dataHeader?.status == 0} variant="red" shape="rounded" className='h-10 disabled:bg-gray-400' onClick={handleCancelBill} />
                        )}

                    </div>
                </Card>

                {dataHeader?.status === 0 ? (
                    <Card className='my-3'>
                        <h2 className='text-xl'>รายการนี้ถูกยกเลิกแล้ว</h2>
                        <p>หมายเหตุ **</p>
                        <p>{dataHeader.note}</p>
                    </Card>
                ) : ("")}
            </div>


            <Card className='w-full md:w-3/12'>
                <h3 className='text-xl'>ข้อมูลทั่วไป</h3>


                <ul className='text-start mt-3 text-sm'>
                    <li>
                        <p className='text-xs text-dark-6 dark:text-dark-5'>ลูกค้า </p>
                        <p>{dataHeader?.member_full_name || "-"} </p>
                    </li>
                    <li className='mt-2'>
                        <p className='text-xs text-dark-6 dark:text-dark-5'>วันที่สร้าง </p>
                        <p>{formathDateThai(String(dataHeader?.created_at))} </p>
                    </li>
                    <li className='mt-2'>
                        <p className='text-xs text-dark-6 dark:text-dark-5'>พนักงาน </p>
                        <p>{dataHeader?.user_username || "-"} </p>
                    </li>

                    {/* <li className='mt-2 flex gap-2'>
                        <div className='border border-gray-300 w-full px-4 py-1 rounded-sm'>
                            <p className='text-xs text-dark-6 dark:text-dark-5'>จ่ายช้า </p>
                            <p>{dataHeader?.late_day} วัน </p>
                        </div>
                        <div className='border border-gray-200 w-full px-4 py-1 rounded-sm'>
                            <p className='text-xs text-dark-6 dark:text-dark-5'>ค่าปรับ </p>
                            <p> {Number(dataHeader?.fee_amount).toLocaleString() || 0} บาท </p>
                        </div>

                    </li> */}

                    <li className='mt-2 flex gap-2'>
                        <div className='border border-gray-300 w-full px-4 py-1 rounded-sm'>
                            <p className='text-xs text-dark-6 dark:text-dark-5'>ผ่อนขำระ </p>
                            <p className='text-base'>{dataHeader?.total_installments || "-"} เดือน </p>
                        </div>
                        <div className='border border-gray-200 w-full px-4 py-1 rounded-sm'>
                            <p className='text-xs text-dark-6 dark:text-dark-5'>ค่างวด </p>
                            <p className='text-base'>{Number(dataHeader?.net_installment).toLocaleString() || 0} บาท </p>
                        </div>
                    </li>
                </ul>

                <hr className='my-4' />

                <ul className='text-start mt-3 text-base'>

                    <li className=''>
                        <p className='text-sm text-dark-6 dark:text-dark-5'>ราคามือถือ </p>
                        <p className='text-base'>{Number(dataHeader?.product_price).toLocaleString() || "0.00"} บาท </p>
                    </li>

                    <li className='mt-2'>
                        <p className='text-sm text-dark-6 dark:text-dark-5'>เปอร์เซ็นต์ เฉพาะบิล </p>
                        <p className='text-base'> {Number(dataHeader?.total_price).toLocaleString() || 0} บาท
                            <span className='text-gray-400 pl-1 text-sm'>({Number(dataHeader?.extra_percent).toLocaleString() || 0}%) </span>
                        </p>
                    </li>

                    <li className='mt-2'>
                        <p className='text-sm text-dark-6 dark:text-dark-5'>เงินดาวน์ </p>
                        <p className='text-base'> {Number(downCal).toLocaleString()} บาท
                            <span className='text-gray-400 pl-1 text-sm'>({Number(dataHeader?.down_percent).toLocaleString() || 0}%) </span>
                        </p>
                    </li>

                    <li className='mt-2'>
                        <p className='text-sm text-dark-6 dark:text-dark-5'>ยอดจัด  </p>
                        <p className='text-base'>{Number(debtCal).toLocaleString() || 0} บาท </p>
                    </li>

                    <li className='mt-2'>
                        <p className='text-sm text-dark-6 dark:text-dark-5'>ค่าปรับ  </p>
                        <p className='text-base'> {Number(dataHeader?.fee_amount).toLocaleString()} บาท
                            <span className='text-gray-400 pl-1 text-sm'>({dataHeader?.late_day} วัน) </span>
                        </p>
                    </li>

                    <hr className='my-4' />

                    <li className='mt-1.5 '>
                        <p className='text-lg text-dark-6 dark:text-dark-5 '>ยอดสุทธิ </p>
                        <p className='text-2xl font-extrabold mt-1'>{Number(sunCal).toLocaleString() || 0} บาท </p>
                    </li>

                </ul>
            </Card>
        </div>

    )
}

export default MemberRentDetail