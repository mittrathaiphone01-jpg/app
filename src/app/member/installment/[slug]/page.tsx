'use client'
import { GlobeIcon } from '@/assets/icons'
import { Checkbox } from '@/components/FormElements/checkbox';
import InputGroup from '@/components/FormElements/InputGroup';
import { RadioInput } from '@/components/FormElements/radio';
import { Select } from '@/components/FormElements/select'
import { ShowcaseSection } from '@/components/Layouts/showcase-section';
import { Button } from '@/components/ui-elements/button';
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertConfirm, AlertConfirmInputText, AlertConfirmYesNo, formathDateThai } from '@/lib/utils';
import { DetailType, HeaderType } from '@/type';
import { api, handleAxiosError } from '@/utils/api';
import axios from 'axios';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { IoMdPrint } from 'react-icons/io';
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
const SelectReact = dynamic(() => import("react-select"), { ssr: false });

interface BlogPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const MemberInstallmentDetail = ({ params }: BlogPageProps) => {
    const { slug } = React.use<{ slug: string }>(params);
    const { data: session, status } = useSession()
    const userId = session?.user.id

    const router = useRouter()


    const [selectDown, setSelectDown] = useState("")
    const [selectIn, setSelectIn] = useState("")
    const [sum, setSum] = useState(0)
    const [selectAddPercen, setSelectAddPercen] = useState(0)

    const [dataHeader, setDataHeader] = useState<HeaderType | null>(null)
    const [dataDetail, setDataDetail] = useState<DetailType[]>([])


    // Show Data Nobile
    const [productNewPrice, setProductNewPrice] = useState(0)
    const [radioCheck, setRadioCheck] = useState(1)

    // Cal
    const sunCal = Number(dataHeader?.total_price) + Number(dataHeader?.fee_amount)


    const fetchDataHeaderById = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/${slug}/in`)
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
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/all/detail/in/${slug}`)
            console.log(res.data);

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

            const res = await api.put(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/${slug}/in`, { status: 0, note: alertResult })
            if (res.status === 200) {
                // router.push('/member/installment')
                window.location.reload();
            }

        } catch (error) {
            const resultt = await handleAxiosError(error)
            toast.error(resultt)
        }
    }

    const handlePrint = useCallback(async (bill_id: number, bill_detail_id: number, status: number) => {
        const loadingToast = toast.loading('กำลังโหลด ....')
        try {


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
            const payload = { bill_id, bill_detail_id, type: 2 }
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
            toast.dismiss(loadingToast)
        }
    }, [])

    const handlePayManule = async () => {
        try {
            const amount = radioCheck === 1 ? Number(dataHeader?.total_price) + Number(dataHeader?.fee_amount) : Number(dataHeader?.remaining_amount)
            const alertResult = await AlertConfirmYesNo(`ชำระเงิน ${Number(amount).toLocaleString()} บาท`, 'กรุณาตรวจสอบยอดเงินก่อนกดตกลง !')
            if (!alertResult) return

            const payload = {
                bill_id: dataHeader?.id,
                bill_detail_id: dataDetail[dataDetail.length - 1]?.id,
                amount
            }
            console.log(payload);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/pay/in`, payload, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LINE_GO_API_TOKEN}`
                }
            })
            if (res.status === 200) {
                toast.success('ทำรายการสำเร็จ')
                router.push('/member/installment')
            }

        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)

        }
    }

    const handleInterest = async () => {
        try {
            const sum = Number(dataHeader?.total_interest_amount) + Number(dataHeader?.fee_amount)
            const alertResult = await AlertConfirmYesNo(`ต่อดอก ${Number(sum).toLocaleString()} บาท`, 'กรุณาตรวจสอบยอดเงินก่อนกดตกลง !')
            if (!alertResult) return

            const pay_amount = Number(dataHeader?.total_interest_amount) + Number(dataHeader?.fee_amount)
            const is_interest_only = true

            if (!dataHeader?.id && !pay_amount && !is_interest_only) {
                toast.error('ข้อมูลไม่ถูกต้อง')
                return
            }
            const latest = dataDetail[dataDetail.length - 1].payment_date
            const today = moment().startOf("day");
            const latestDate = moment(latest).startOf("day");

            console.log({ today: today.format("YYYY-MM-DD") });
            console.log({ latestDate: latestDate.format("YYYY-MM-DD") });
            console.log({ pay_amount });


            if (today.isBefore(latestDate)) {
                toast.error('ยังไม่ถึงเวลาที่กำหนด ไม่สามารถต่อดอกได้')
                return
            }


            const res = await api.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/renew/${dataHeader?.id}`, {
                pay_amount,
                is_interest_only
            })
            console.log(res);

            if (res.status === 200) {
                await fetchDataHeaderById()
                await fetchDataDetail()
            }


        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)

        }
    }

    useEffect(() => {

        if (status !== "authenticated") {
            console.log('no session');
            return
        }

        if (slug) {
            fetchDataHeaderById()
            fetchDataDetail()
        }
    }, [slug, status, session])

    return (
        <div className='flex flex-col md:flex-row gap-4'>

            <div className='w-full md:w-9/12 h-full'>
                <Card >
                    <div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
                        <h3 className='text-xl'>ข้อมูลบิล <span className='text-dark-2 dark:text-dark-8'> {dataHeader?.invoice}  </span></h3>
                        <p>สถานะ {dataHeader?.status === 1 ? "กำลังจ่าย" : dataHeader?.status === 0 ? "ยกเลิกบิล" : ""} </p>
                    </div>

                    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-4 mt-4   ">
                        <div className=' overflow-y-auto'>
                            <Table className='  '>
                                <TableHeader>
                                    <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white text-center">
                                        <TableHead className='text-center'>งวดที่</TableHead>
                                        <TableHead className='text-center'>ยอดชำระ</TableHead>
                                        <TableHead className='text-center'>ดอกเบี้ย</TableHead>
                                        <TableHead className='text-center'>ค่าปรับ</TableHead>
                                        <TableHead className='text-center'>รวเป็นเงิน</TableHead>
                                        <TableHead className='text-center'>วันที่สร้าง</TableHead>
                                        <TableHead className='text-center'>ครบกำหนด</TableHead>
                                        <TableHead className='text-center'>สถานะ</TableHead>
                                        <TableHead className='text-center'>ใบเสร็จ</TableHead>
                                    </TableRow>
                                </TableHeader>


                                <TableBody>
                                    {dataDetail?.map((item, index) => {
                                        const sumCal = Number(item.installment_price) - Number(item.fee_amount)
                                        const interest = ((Number(item.installment_price) - Number(dataHeader?.loan_amount)) - (Number(item?.fee_amount)))
                                        return (
                                            <TableRow key={item.id} className="border-[#eee] dark:border-dark-3 text-center">

                                                <TableCell className='min-w-[80px] text-center'>
                                                    {/* <p className="text-dark dark:text-white">งวดที่ {item.payment_no}/{dataDetail.length}</p> */}
                                                    <p className="text-dark dark:text-white">งวดที่ {index + 1}/{dataDetail.length}</p>

                                                </TableCell>

                                                <TableCell className='min-w-[120px] text-center'>
                                                    <p className="text-dark dark:text-white">{Number(dataHeader?.loan_amount).toLocaleString() || "-"}</p>
                                                </TableCell>

                                                <TableCell className='min-w-[120px] text-center'>
                                                    {/* <p className="text-dark dark:text-white">{Number(item.installment_price).toLocaleString() || "-"}</p> */}
                                                    <p className="text-dark dark:text-white">
                                                        {Number(interest).toLocaleString()}
                                                    </p>

                                                </TableCell>


                                                <TableCell className="min-w-[120px]  text-center">
                                                    <p className="text-dark dark:text-white">{Number(item.fee_amount).toLocaleString() || "-"}</p>
                                                </TableCell>



                                                <TableCell className="min-w-[120px]  text-center">
                                                    <p className="text-dark dark:text-white">{Number(item.installment_price).toLocaleString() || "-"}</p>
                                                </TableCell>

                                                <TableCell className='min-w-[120px] text-center'>
                                                    <p className="text-dark dark:text-white">{formathDateThai(item.created_at) || "-"}</p>
                                                </TableCell>

                                                <TableCell className='min-w-[120px] text-center'>
                                                    <p className="text-dark dark:text-white">{formathDateThai(item.payment_date) || "-"}</p>
                                                </TableCell>

                                                <TableCell className='min-w-[120px] text-center'>
                                                    <p className={`text-dark dark:text-white ${item?.status === 0 ? "bg-red-200" : item?.status === 1 ? "bg-green-200" : item.status === 2 ? "bg-yellow-400/30" : ""} rounded-sm `}>
                                                        {item?.status === 0 ? "ยังไม่จ่าย" : item?.status === 1 ? "จ่ายแล้ว" : item?.status === 2 ? "ต่อดอกแล้ว" : ""}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="min-w-[100px] xl:pl-7.5 flex justify-center">
                                                    <button onClick={() => handlePrint(Number(dataHeader?.id), item.id, item.status)}>
                                                        <IoMdPrint size={25} />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        {/* <Pagination
                    currentPage={page}
                    totalPages={totalPage}
                    totalData={totalData}
                    onPageChange={(p) => setPage(p)}
                    className="mt-4 flex justify-end"
                /> */}
                    </div>

                    <div className='flex flex-col md:flex-row gap-4 justify-end mt-5'>
                        <Link href='/member/installment'> <Button label='ย้อนกลับ' variant="outlinePrimary" shape="rounded" className='h-10  w-full' /></Link>
                        {session?.user.role_id === 1 && (
                            <Button label='ยกเลิกบิล' disabled={dataHeader?.status == 0} variant="red" shape="rounded" className='h-10 disabled:bg-gray-400 ' onClick={handleCancelBill} />
                        )}
                        <Button label='ต่อดอก' variant="green" className=' rounded-md h-10  disabled:bg-gray-400' onClick={handleInterest} />

                    </div>

                </Card>

                {dataHeader?.term_type === 1 && (
                    <Card className='mt-4 w-full md:w-1/2'>
                        <h3 className='text-lg'>รูปแบบการคิดดอกเบี้ย</h3>
                        <div className='flex gap-4 mt-4'>
                            <RadioInput label="คิดเต็มจำนวน" checked={radioCheck === 1} onChange={() => setRadioCheck(1)} variant="circle" />
                            <RadioInput label="คิดตามจริง" checked={radioCheck === 2} onChange={() => setRadioCheck(2)} variant="circle" />
                        </div>
                        <Button label='ชำระเงิน' className=' rounded-md h-8 w-full mt-4 disabled:bg-gray-400' onClick={handlePayManule} disabled={dataHeader.status === 0} />

                    </Card>
                )}

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

                    <li className='mt-2 flex gap-2'>
                        <div className='border border-gray-300 w-full px-4 py-1 rounded-sm'>
                            <p className='text-xs text-dark-6 dark:text-dark-5'>ระยะเวลาทั้งหมด </p>
                            <p className='text-base'>{dataHeader?.term_type === 1 ? "10 วัน" : `${dataHeader?.total_installments || "-"} เดือน`} </p>
                        </div>

                        {/* <div className='border border-gray-200 w-full px-4 py-1 rounded-sm'>
                            <p className='text-xs text-dark-6 dark:text-dark-5'>ค่าปรับ </p>
                            <p> {Number(dataHeader?.fee_amount).toLocaleString() || 0} บาท </p>
                        </div> */}

                    </li>

                </ul>

                <hr className='my-4' />

                <ul className='text-start mt-3 text-base'>

                    <li className=''>
                        <p className='text-sm text-dark-6 dark:text-dark-5'>ราคามือถือ </p>
                        <p className='text-base'>{Number(dataHeader?.product_price).toLocaleString() || "0.00"}  บาท </p>
                    </li>
                    <li className='mt-1.5'>
                        <p className='text-sm text-dark-6 dark:text-dark-5'>ยอดแลกเงิน </p>
                        <p className='text-base'>{Number(dataHeader?.loan_amount).toLocaleString()} บาท</p>
                    </li>

                    {/* {dataHeader?.term_type === 2 && (
                        <li className='mt-2'>
                            <p className='text-sm text-dark-6 dark:text-dark-5'>เปอร์เซ็นต์ เฉพาะบิล </p>
                            <p className='text-base'> {Number(dataHeader?.total_price).toLocaleString() || 0} บาท
                                <span className='text-gray-400 pl-1 text-sm'>({ Number(dataHeader?.extra_percent).toLocaleString() || 0}%) </span>
                            </p>
                        </li>
                    )} */}

                    {/* 
                    {dataHeader?.term_type === 2 && (
                        <li className='mt-1.5'>
                            <p className='text-sm text-dark-6 dark:text-dark-5'>ระยะเวลา  </p>
                            <p className='text-base'>{dataHeader?.total_installments || "-"} เดือน </p>
                        </li>
                    )} */}

                    {dataHeader?.term_type === 1 ? (
                        <li className='mt-1.5 bg-gray-100  '>
                            <p className='text-sm '>ดอกเบี้ยตามจริง </p>
                            <p className='text-base'>{Number(dataHeader?.interest_amount).toLocaleString() || 0}  บาท</p>
                        </li>
                    ) : ("")}

                    <li className='mt-1.5 '>
                        <p className='text-sm text-dark-6 dark:text-dark-5'>ดอกเบี้ยทั้งหมด </p>
                        <p className='text-base'>{Number(dataHeader?.total_interest_amount).toLocaleString() || 0}  บาท
                            <span className='text-gray-400 pl-1 text-sm'>({dataHeader?.term_type === 1 ? 10 : Number(dataHeader?.extra_percent).toLocaleString() || 0}%) </span>
                        </p>
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
                        <p className='text-2xl font-extrabold mt-1'>
                            {radioCheck === 1 ? (Number(sunCal).toLocaleString() || 0) : (Number(dataHeader?.remaining_amount).toLocaleString())} บาท </p>
                    </li>

                    {/* <li className='mt-1.5 '>
                        <p className='text-sm text-dark-6 dark:text-dark-5'>ยอดชำระสุทธิ </p>
                        <p className='text-xl'>{Number(dataHeader?.total_price).toLocaleString() || 0}  บาท </p>
                    </li> */}

                </ul>
            </Card>
        </div>
    )
}

export default MemberInstallmentDetail

