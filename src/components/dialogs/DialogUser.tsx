'use client'
import React, { useEffect, useState } from 'react'
import Dialogs from '../ui/Dialog'
import InputGroup from '../FormElements/InputGroup'
import { toast } from 'react-toastify'
import { api, handleAxiosError } from '@/utils/api'
import { FiRotateCw } from 'react-icons/fi'
import { Switch } from '../FormElements/switch'

interface propType {
    isOpen: boolean
    openDialog: () => void
    id: number | null
    fetchData: () => Promise<void>
    setPage: (value: number) => void
}

const DialogUser = ({ isOpen, openDialog, id, fetchData, setPage }: propType) => {

    const [tel, setTel] = useState("")
    const [full_name, setFullName] = useState("")

    const clearData = () => {
        setTel("")
        setFullName("")
    }

    const handleSave = async () => {
        try {
            if (!full_name) {
                toast.error('กรอกข้อมูลไม่ครบ !')
                return
            }
            const payload = {
                full_name,
                tel,


            }
            if (!id) {
                const res = await api.post(`${process.env.NEXT_PUBLIC_API}/members/${process.env.NEXT_PUBLIC_V}/create`, payload)
                if (res.status === 200 || res.status === 201) {
                    toast.success('ทำรายการสำเร็จ')
                    await fetchData()
                    openDialog()
                    clearData()
                    setPage(1)
                }
            } else {
                const res = await api.put(`${process.env.NEXT_PUBLIC_API}/members/${process.env.NEXT_PUBLIC_V}/${id}`, payload)
                if (res.status === 200 || res.status === 201) {
                    toast.success('ทำรายการสำเร็จ')
                    await fetchData()
                    openDialog()
                }

            }

        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)

        }
    }

    const fetchDataById = async () => {
        try {
            if (!id) {
                toast.error('ไม่พบ ID')
                return
            }
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/members/${process.env.NEXT_PUBLIC_V}/${id}`)
            console.log(res.data);

            if (res.status === 200) {
                setFullName(res.data.full_name)
                setTel(res.data.tel)

            }

        } catch (error) {
            console.log(error);

        }
    }


    useEffect(() => {
        // clearData()
        if (isOpen) clearData()
        if (id) {
            fetchDataById()
        }
    }, [id, isOpen])

    return (
        <Dialogs
            isOpen={isOpen}
            onClose={openDialog}
            title={`${!id ? "เพิ่มข้อมูลใหม่" : "แก้ไขข้อมูล"}`}
        >

            <section className='py-2'>
                <div className='flex flex-col md:flex-row gap-4'>
                    <InputGroup
                        label="ชื่อ-สกุล"
                        placeholder="ชื่อ"
                        type="text"
                        className='w-full'
                        value={full_name}
                        onChange={(e) => setFullName(e.target.value)}
                        maxLength={20}
                    />
                </div>

                <div className='flex flex-col md:flex-row gap-4'>
                    <InputGroup
                        label="เบอร์โทรศัพท์"
                        placeholder="เบอร์โทรศัพท์"
                        type="text"
                        className='w-full'
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        maxLength={10}
                    />


                </div>
            </section>

            <div className="mt-6 text-right flex justify-end gap-2">
                <button
                    type="button"
                    className="rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-400"
                    onClick={openDialog}
                >
                    ยกเลิก
                </button>

                <button
                    type="button"
                    className="rounded-md border border-transparent bg-primary text-white px-4 py-2 text-sm font-medium  hover:bg-blue-200"
                    onClick={handleSave}
                >
                    {!id ? "บันทึก" : "อัพเดท"}
                </button>
            </div>
        </Dialogs>
    )
}

export default DialogUser

