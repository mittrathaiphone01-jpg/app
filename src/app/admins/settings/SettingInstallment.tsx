import InputGroup from '@/components/FormElements/InputGroup'
import { Button } from '@/components/ui-elements/button';
import Card from '@/components/ui/Card'
import { api, handleAxiosError } from '@/utils/api';
import React, { useEffect, useState } from 'react'
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { toast } from 'react-toastify';


const SettingInstallment = () => {
    const [data, setData] = useState<number>(0)
    const [dataSend, setDataSend] = useState<number>(0)
    const [id, setId] = useState<number | null>(null)

    const fetchData = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/fines/${process.env.NEXT_PUBLIC_V}/all`)
            console.log(res.data);

            if (res.status === 200) {
     
                for (let i=0; i < res.data.length; i++){
                    if(res.data[i].fine_system_category_id === 1){
                        setData(res.data[i].fine_amount)
                        setId(res.data[i].id)
                        break;
                    }
                }


            }
        } catch (error) {
            console.log(error);

        }
    }

    const handleSave = async () => {
        try {
            if (!id) {
                toast.error('ไม่พบข้อมูล ID'); return
            }
            const payload = {
                fine_amount: dataSend,
                fine_system_category_id: 1
            }
            console.log(payload);
            
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

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className='w-full md:w-1/2'>
            <Card >
                <div className='flex flex-row gap-2 items-end '>
                    <InputGroup
                        label="ตั้งค่า ค่าปรับ (ผ่อน)"
                        placeholder="0.00"
                        type="number"
                        className='w-full'
                        icon={<FaRegMoneyBillAlt />}
                        iconPosition="left"
                        value={String(dataSend)}
                        onChange={(e) => setDataSend(Number(e.target.value))}
                        minLength={0}
                    />
                    <Button label='บันทึก' className='h-12' variant="primary" shape="rounded" onClick={handleSave} />
                </div>
                <h2 className='mt-6 text-2xl text-center'>ค่าปรับ {data} บาท</h2>
            </Card>
        </div>
    )
}

export default SettingInstallment