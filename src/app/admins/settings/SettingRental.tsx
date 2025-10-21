import { PencilSquareIcon, TrashIcon } from '@/assets/icons';
import InputGroup from '@/components/FormElements/InputGroup'
import { Button } from '@/components/ui-elements/button';
import Card from '@/components/ui/Card'
import { AlertConfirm } from '@/lib/utils';
import { api, handleAxiosError } from '@/utils/api';
import React, { useEffect, useState } from 'react'
import { FaCalendar, FaRegMoneyBillAlt } from "react-icons/fa";
import { toast } from 'react-toastify';

interface dataDayProp {
    id: number
    day: string | number
}


const SettingRental = () => {
    const [data, setData] = useState<number>(0)
    const [dataDay, setDataDay] = useState<dataDayProp[]>([])
    const [dataSend, setDataSend] = useState<number>(0)
    const [dataSendDay, setDataSendDay] = useState<number>(1)
    const [id, setId] = useState<number | null>(null)
    const [idDay, setIdDay] = useState<number | null>(null)


    const fetchData = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/fines/${process.env.NEXT_PUBLIC_V}/all`)
            console.log(res.data);

            if (res.status === 200) {

                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].fine_system_category_id === 2) {
                        setData(res.data[i].fine_amount)
                        setId(res.data[i].id)
                        break;
                    }
                }
            }
        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)

        }
    }


    const fetchDataDay = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/installments/${process.env.NEXT_PUBLIC_V}/all`)
            console.log(res.data);

            if (res.status === 200) {
                setDataDay(res.data)

                // for (let i = 0; i < res.data.length; i++) {
                //     if (res.data[i].fine_system_category_id === 2) {
                //         setData(res.data[i].fine_amount)
                //         setId(res.data[i].id)
                //         break;
                //     }
                // }

            }
        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)

        }
    }

    const handleSave = async () => {
        try {
            if (!id) {
                toast.error('ไม่พบข้อมูล ID'); return
            }
            const payload = {
                fine_amount: dataSend,
                fine_system_category_id: 2
            }
            const res = await api.put(`${process.env.NEXT_PUBLIC_API}/fines/${process.env.NEXT_PUBLIC_V}/${id}`, payload)
            if (res.status === 200) {
                toast.success('ทำรายการสำเร็จ')
                await fetchData()
                setDataSend(0)
            }
        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)

        }
    }

    const handleSaveDay = async () => {
        try {

            const payload = {
                day: dataSendDay
            }
            console.log(dataSendDay);
            if(dataSendDay === 0) {
                toast.error('ไม่ให้เพิ่ม 0 วัน')
                return
            }
            
            if (!idDay) {

                const res = await api.post(`${process.env.NEXT_PUBLIC_API}/installments/${process.env.NEXT_PUBLIC_V}/create`, payload)
                if (res.status === 200 || res.status === 201) {
                    toast.success('ทำรายการสำเร็จ')
                    await fetchDataDay()
                    setDataSendDay(0)
                }

            }
            else {
                const res = await api.put(`${process.env.NEXT_PUBLIC_API}/installments/${process.env.NEXT_PUBLIC_V}/${idDay}`, payload)
                if (res.status === 200 || res.status === 201) {
                    toast.success('ทำรายการสำเร็จ')
                    await fetchDataDay()
                    setDataSendDay(0)
                    setIdDay(null)
                }
            }

        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)

        }
    }


    const handleDelete = async (id: number, day: string | number) => {
        try {
            if (!id) {
                toast.error('ไม่พบข้อมูล ID'); return
            }
            const alertResult = await AlertConfirm(`ลบข้อมูล - ${day || ""} วัน`, 'ต้องการลบข้อมูลนี้หรือไม่ ?')
            if (!alertResult) return false


            const res = await api.delete(`${process.env.NEXT_PUBLIC_API}/installments/${process.env.NEXT_PUBLIC_V}/${id}`)
            console.log(res);

            if (res.status === 204) {
                toast.success('ทำรายการสำเร็จ')
                await fetchDataDay()
                setDataSend(0)
            }

        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)

        }
    }

    useEffect(() => {
        fetchData()
        fetchDataDay()
    }, [])

    return (
        <div>
            <div className='w-full md:w-1/2'>
                <Card >
                    <div className='flex flex-row gap-2 items-end '>
                        <InputGroup
                            label="ตั้งค่า ค่าปรับ (เช่า)"
                            placeholder="0.00"
                            type="number"
                            className='w-full'
                            icon={<FaRegMoneyBillAlt />}
                            iconPosition="left"
                            value={String(dataSend)}
                            onChange={(e) => setDataSend(Number(e.target.value))}
                            minLength={1}
                       
                        />
                        <Button label='บันทึก' className='h-12' variant="primary" shape="rounded" onClick={handleSave} />
                    </div>
                    <h2 className='mt-6 text-2xl text-center'>ค่าปรับ {data} บาท</h2>
                </Card>
            </div>

            <hr className='my-4 md:my-8' />
            <div className="mt-5 flex flex-col md:flex-row gap-4">
                <div className='w-full '>
                    <Card >
                        <div className='flex flex-col md:flex-row gap-2 items-end '>
                            <InputGroup
                                label="ตั้งค่า จำนวนเดือน-ให้เช่า"
                                placeholder="0.00"
                                type="number"
                                className='w-full'
                                icon={<FaCalendar />}
                                iconPosition="left"
                                value={String(dataSendDay)}
                                onChange={(e) => setDataSendDay(Number(e.target.value))}
                                minLength={0}
                            />
                           <div className='flex flex-row gap-2 justify-center items-center'>
                             <Button label='ยกเลิก' className='h-12' variant="outlinePrimary" shape="rounded" onClick={() => {
                                setDataSendDay(0)
                                setIdDay(null)
                            }} />
                            <Button label={idDay ? "แก้ไข" : "บันทึก"} className='h-12' variant="primary" shape="rounded" onClick={handleSaveDay} />

                           </div>
                        </div>
                    </Card>
                </div>
                <div className='w-full'>
                    <Card className=''>
                        <h3 className='text-xl'>รายการจำนวนเดือน</h3>

                        <ul className='py-4 mt-2 px-4 overflow-y-auto h-46'>
                            {dataDay?.map((item) => (
                                <li className=' border-b hover:bg-gray-100' key={item.id}>
                                    <div className='flex justify-between pt-3 pb-3 '>
                                        <p>{item.day} เดือน</p>
                                        <div className='flex gap-2'>
                                            <PencilSquareIcon className=' cursor-pointer' onClick={() => {
                                                setDataSendDay(Number(item.day))
                                                setIdDay(item.id)
                                            }} />
                                            <TrashIcon className=' cursor-pointer' onClick={() => handleDelete(item.id, item.day)} />
                                        </div>
                                    </div>
                                </li>

                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default SettingRental

