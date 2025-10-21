import { Fragment, useCallback, useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { api, handleAxiosError } from '@/utils/api';
import { DetailType, HeaderType } from '@/type';
import Card from '../ui/Card';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Link from 'next/link';
import { Button } from '../ui-elements/button';
import { formathDateThai } from '@/lib/utils';
import { IoMdPrint } from 'react-icons/io';
import axios from 'axios';

interface MyModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill_id: number | null
    type: number
}

const ReportDetails = ({ isOpen, onClose, bill_id, type }: MyModalProps) => {

    const [dataHeader, setDataHeader] = useState<HeaderType | null>(null)
    const [dataDetail, setDataDetail] = useState<DetailType[]>([])

    // cal
    const downCal = (Number(dataHeader?.total_price) * Number(dataHeader?.down_percent)) / 100
    const debtCal = Number(dataHeader?.total_price) - Number(downCal)
    const sunCal = downCal + debtCal + Number(dataHeader?.fee_amount)

    const fetchDataHeaderById = async () => {
        try {
            let addUrl = ""
            if (type === 2) addUrl = "/in"
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/${bill_id}${addUrl}`)
            if (res.status === 200) {
                console.log(res.data.data);
                setDataHeader(res.data.data)
            }
        } catch (error) {
            const resultt = await handleAxiosError(error)
            toast.error(resultt)
        }
    }

    const fetchData = async () => {
        try {
            let addUrl = ""
            if (type === 2) addUrl = "/in"
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/all/detail${addUrl}/${bill_id}`)
            console.log(res.data.data);
            console.log(res.data);
            if (res.status === 200) {
                setDataDetail(res.data.data)
            }

        } catch (error) {
            console.log(error);

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
            const payload = { bill_id, bill_detail_id, type: type }
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

    useEffect(() => {
        fetchDataHeaderById()
        fetchData()
    }, [])

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>

                {/* Overlay - พื้นหลังทึบที่อยู่เบื้องหลัง Modal */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {/* นี่คือ Backdrop/Overlay ที่ใช้ Tailwind CSS จัดการสไตล์ */}
                    <div className="fixed inset-0 bg-black bg-opacity-75" />
                </TransitionChild>

                {/* Container หลักของ Modal เพื่อจัดให้อยู่กึ่งกลาง */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">

                        {/* ตัว Modal Content */}
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            {/* นี่คือตัวกล่อง Modal ที่มีเนื้อหา ใช้ Tailwind จัดสไตล์ทั้งหมด */}
                            <DialogPanel className="w-full max-w-screen-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                <DialogTitle
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    รายละเอียด

                                </DialogTitle>

                                <div className='flex flex-col md:flex-row gap-4'>

                                    <div className='w-full md:w-9/12 h-full'>

                                        <Card >
                                            <div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
                                                <h3 className='text-xl'>ข้อมูลบิล <span className='text-dark-2 dark:text-dark-8'> {dataHeader?.invoice}</span></h3>
                                                <p>สถานะ {dataHeader?.status === 1 ? "กำลังจ่าย" : dataHeader?.status === 0 ? "ยกเลิกบิล" : dataHeader?.status === 2 ? "ชำระเงินครบแล้ว" : ""}</p>
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
                                                                <TableHead className='text-center'>กำหนดชำระ</TableHead>
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


                                        </Card>

                                        {dataHeader?.status === 0 ? (
                                            <Card className='my-3'>
                                                <h2 className='text-xl'>รายการนี้ถูกยกเลิกแล้ว</h2>
                                                <p>หมายเหตุ **</p>
                                                <p>{dataHeader.note}</p>
                                            </Card>
                                        ) : ("")}
                                    </div>


                                    <Card className='w-full md:w-3/12 border'>
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

                                            {dataHeader?.term_type === 1 && (
                                                <li className='mt-2 flex gap-2'>
                                                    <div className='border border-gray-300 w-full px-4 py-1 rounded-sm'>
                                                        <p className='text-xs text-dark-6 dark:text-dark-5'>ระยะเวลาทั้งหมด </p>
                                                        <p className='text-base'>{dataHeader?.term_type === 1 ? "10 วัน" : `${dataHeader?.total_installments || "-"} เดือน`} </p>
                                                    </div>
                                                </li>
                                            )}

                                            {dataHeader?.term_type === 2 && (
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
                                            )}

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
                                                    <span className='text-gray-400 pl-1 text-sm'>({dataHeader?.term_type === 1 ? 10 : Number(dataHeader?.extra_percent).toLocaleString() || 0}%) </span>
                                                </p>
                                            </li>
                                            {type === 1 && (
                                                <li className='mt-2'>
                                                    <p className='text-sm text-dark-6 dark:text-dark-5'>เงินดาวน์ </p>
                                                    <p className='text-base'> {Number(downCal).toLocaleString()} บาท
                                                        <span className='text-gray-400 pl-1 text-sm'>({Number(dataHeader?.down_percent).toLocaleString() || 0}%) </span>
                                                    </p>
                                                </li>
                                            )}
                                            {type === 1 && (
                                                <li className='mt-2'>
                                                    <p className='text-sm text-dark-6 dark:text-dark-5'>ยอดจัด  </p>
                                                    <p className='text-base'>{Number(debtCal).toLocaleString() || 0} บาท </p>
                                                </li>
                                            )}



                                            {type === 2 && (
                                                <li className='mt-2'>
                                                    <p className='text-sm text-dark-6 dark:text-dark-5'>ยอดแลกเงิน </p>
                                                    <p className='text-base'>{Number(dataHeader?.loan_amount).toLocaleString()} บาท</p>
                                                </li>
                                            )}

                                            {type === 2 && (
                                                dataHeader?.term_type === 2 && (
                                                    <li className='mt-2'>
                                                        <p className='text-sm text-dark-6 dark:text-dark-5'>ระยะเวลาทั้งหมด  </p>
                                                        <p className='text-base'>{dataHeader?.total_installments || "-"} เดือน </p>
                                                    </li>
                                                )
                                            )}

                                            {type === 2 && (
                                                dataHeader?.term_type === 1 ? (
                                                    <li className='mt-2 bg-gray-100  '>
                                                        <p className='text-sm '>ดอกเบี้ยตามจริง </p>
                                                        <p className='text-base'>{Number(dataHeader?.interest_amount).toLocaleString() || 0}  บาท</p>
                                                    </li>
                                                ) : ("")
                                            )}


                                            {type === 2 && (
                                                <li className='mt-1.5 '>
                                                    <p className='text-sm text-dark-6 dark:text-dark-5'>ดอกเบี้ยทั้งหมด </p>
                                                    <p className='text-base'>{Number(dataHeader?.total_interest_amount).toLocaleString() || 0}  บาท </p>
                                                </li>

                                            )}

                                            <li className='mt-2'>
                                                <p className='text-sm text-dark-6 dark:text-dark-5'>ค่าปรับ  </p>
                                                <p className='text-base'> {Number(dataHeader?.fee_amount).toLocaleString()} บาท
                                                    <span className='text-gray-400 pl-1 text-sm'>({dataHeader?.late_day} วัน) </span>
                                                </p>
                                            </li>

                                            <hr className='my-4' />

                                            <li className='mt-1.5 '>
                                                <p className='text-lg text-dark-6 dark:text-dark-5 '>ยอดสุทธิ </p>
                                                <p className='text-2xl font-extrabold mt-1'>{Number(dataHeader?.paid_amount).toLocaleString() || 0} บาท </p>
                                            </li>
                                        </ul>
                                    </Card>
                                </div>

                                <div className="mt-4 text-end">
                                    <Button label='ออก' type="button" className='h-10 rounded-md' onClick={onClose} />

                                </div>

                            </DialogPanel>
                        </TransitionChild>

                    </div>
                </div>

            </Dialog>
        </Transition>
    )
}

export default ReportDetails