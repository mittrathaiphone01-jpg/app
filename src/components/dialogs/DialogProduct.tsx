import React, { FormEvent, useEffect, useState } from 'react'
import Dialogs from '../ui/Dialog'
import InputGroup from '../FormElements/InputGroup'
import { toast } from 'react-toastify'
import { Select } from '../FormElements/select'
import { GlobeIcon } from '@/assets/icons'
import { api, apiForm, handleAxiosError } from '@/utils/api'
import { dataCategoryType } from '@/type'

interface propType {
    isOpen: boolean
    openDialog: () => void
    id: number | null
    fetchData: () => Promise<void>
    role: number | undefined
    setPage: (value: number) => void
}




const DialogProduct = ({ isOpen, openDialog, id, fetchData, role, setPage }: propType) => {
    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [price, setPrice] = useState<string>("")
    const [category_id, setCategoryId] = useState("")
    const [images, setImages] = useState<File | null>(null)
    const [oldImage, setOldImage] = useState("")
    const [delete_image_ids, setDeleteImageIds] = useState("")
    const [sku, setSku] = useState("")

    const [dataCategory, setDataCategory] = useState<dataCategoryType[]>([])

    const handleClear = () => {
        setName("")
        setDescription("")
        setPrice("")
        setCategoryId("")
        setImages(null)
        setSku("")
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (!name || !price || !category_id) {
                toast.error('กรอกข้อมูลไม่ครบ')
                return;
            }
            const formData = new FormData()
            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("category_id", category_id)
            if (images) {
                formData.append("images", images)
            }
            if (id && images) {
                formData.append("new_images", images)
                formData.append(`replace_${delete_image_ids}`, oldImage)
                formData.append(`delete_image_ids`, delete_image_ids)
            }

            for (const [key, value] of formData.entries()) {
                console.log(key, value)
            }

            if (!id) {
                // const res = await apiForm.post(`${process.env.NEXT_PUBLIC_API}/product/${process.env.NEXT_PUBLIC_V}/create`, formData)
                const res = await apiForm.post(`https://api-go.thaibusinessmate.com/product/v1/create`, formData)
                console.log(res);
                
                if (res.status === 201) {
                    openDialog()
                    toast.success('บันทึกสำเร็จ')
                    await fetchData()
                    setPage(1)
                }

            } else {
                const res = await apiForm.put(`${process.env.NEXT_PUBLIC_API}/product/${process.env.NEXT_PUBLIC_V}/${id}`, formData)
                console.log(res);
                if (res.status === 200) {
                    openDialog()
                    toast.success('บันทึกสำเร็จ')
                    await fetchData()
                }
            }



        } catch (error) {
            handleAxiosError(error)
            toast.error('เกิดข้อผิดพลาด')
        }
    }

    const fetchDataCategory = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/product-category/${process.env.NEXT_PUBLIC_V}/all`)

            if (res.status === 200) {
                const options = [
                    { label: 'เลือก', value: "" },
                    ...res.data.categories.map((cat: dataCategoryType) => ({
                        label: cat.name,
                        value: cat.id.toString()
                    }))
                ]
                setDataCategory(options)
            }

        } catch (error) {
            console.log(error);

        }
    }

    const fetchDataById = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/product/${process.env.NEXT_PUBLIC_V}/${id}`)
            console.log(res.data);

            if (res.status === 200) {
                setName(res.data.name)
                setDescription(res.data.description)
                setPrice(res.data.price)
                setSku(res.data.sku)
                setOldImage(res.data.images[0].url)
                setDeleteImageIds(res.data.images[0].id)
                setCategoryId(res.data.category_id)
            }

        } catch (error) {
            console.log(error);

        }
    }





    useEffect(() => {
        handleClear()
        if (isOpen) fetchDataCategory()
        if (id) fetchDataById()

    }, [isOpen, id])


    return (
        <Dialogs
            isOpen={isOpen}
            onClose={openDialog}
            title={`${!id ? "เพิ่มข้อมูลใหม่" : "แก้ไขข้อมูล"}`}
        >

            <form onSubmit={handleSubmit} >
                <section className='py-2'>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <InputGroup
                            label="รหัสสินค้า"
                            placeholder=""
                            type="text"
                            className='w-full'
                            disabled
                            value={sku || ""}
                        />
                        <Select
                            label="เลือกประเภท"
                            items={dataCategory}
                            defaultValue=""
                            prefixIcon={<GlobeIcon />}
                            className='w-full'
                            value={category_id}
                            onChange={async (val) => setCategoryId(val)}
                        />
                    </div>

                    <div className='flex flex-col md:flex-row gap-4 mt-3'>
                        <InputGroup
                            label="ชื่อสินค้า"
                            placeholder="ชื่อสินค้า"
                            type="text"
                            className='w-full'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={30}
                        />


                    </div>

                    <div className='flex flex-col md:flex-row gap-4 mt-3'>
                        <InputGroup
                            label="ราคา"
                            placeholder="0.00"
                            type="number"
                            className='w-full'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={role !== 1 && id !== null}
                            minLength={0}
                        />

                        <InputGroup
                            type="file"
                            fileStyleVariant="style2"
                            label="รูปสินค้า"
                            placeholder="รูปสินค้า"
                            className='w-full'
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImages(e.target.files[0])
                                }
                            }}
                        />
                    </div>

                    <div className='flex flex-col md:flex-row gap-4 mt-3'>

                        <InputGroup
                            label="รายละเอียด"
                            placeholder="กรอกรายละเอียด"
                            type="text"
                            className='w-full'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={50}
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
                        type="submit"
                        className="rounded-md border border-transparent bg-primary text-white px-4 py-2 text-sm font-medium  hover:bg-blue-200"
                    >
                        {!id ? "บันทึก" : "อัพเดท"}
                    </button>
                </div>
            </form>
        </Dialogs>
    )
}

export default DialogProduct

