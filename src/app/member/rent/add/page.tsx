'use client'
import { GlobeIcon } from '@/assets/icons'
import InputGroup from '@/components/FormElements/InputGroup';
import { Select } from '@/components/FormElements/select'
import { Button } from '@/components/ui-elements/button';
import Card from '@/components/ui/Card'
import { dataCategoryType } from '@/type';
import { api, handleAxiosError } from '@/utils/api';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
const SelectReact = dynamic(() => import("react-select"), { ssr: false });



interface BlogPageProps {

}

type OptionType = {
    value: string;
    label: string;
    id: number
    full_name: string
    name: string
    images?: { url: string }[]
    price?: string

};

const AddRent = ({ }: BlogPageProps) => {

    const { data: session, status } = useSession()
    const userId = session?.user.id

    const router = useRouter()

    const [optionUser, setOptionUser] = useState<OptionType[]>([]);
    const [optionProduct, setOptionProduct] = useState<OptionType[]>([]);
    const [selectedUser, setSelectedUser] = useState<SingleValue<OptionType>>(null);
    const [selectedProduct, setSelectedProduct] = useState<SingleValue<OptionType>>(null);

    const [dataCategory, setDataCategory] = useState<dataCategoryType[]>([])
    const [selectedCategory, setSelectedCategory] = useState<SingleValue<OptionType>>(null);

    const [selectDown, setSelectDown] = useState("")
    const [selectIn, setSelectIn] = useState("")
    const [sum, setSum] = useState(0)
    const [selectAddPercen, setSelectAddPercen] = useState(0)

    // Show Data Nobile
    const [productNewPrice, setProductNewPrice] = useState(0)


    const fetchDataUser = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/members/${process.env.NEXT_PUBLIC_V}/all`)
            console.log(res.data.data);

            if (res.status === 200) {
                const opts: OptionType[] = res.data.data.map((item: OptionType) => ({
                    value: item.id,
                    label: item.full_name,
                }))
                setOptionUser(opts)
            }
        } catch (error) {
            console.log(error);
        }
    }


    const fetchDataProduct = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/product/${process.env.NEXT_PUBLIC_V}/all`, {
                params: {
                    category_id: Number(selectedCategory?.value) || ""
                }
            })
            console.log(res.data.data);
            if (res.status === 200) {
                const opts: OptionType[] = res.data.data.map((item: OptionType) => ({
                    value: item.id,
                    label: item.name,
                    images: item.images?.[0]?.url,
                    price: item.price
                }))
                setOptionProduct(opts)
            }
        } catch (error) {
            console.log(error);

        }
    }


    const fetchDataCategory = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/product-category/${process.env.NEXT_PUBLIC_V}/all`)

            if (res.status === 200) {
                const options = [
                    { label: 'ทั้งหมด', value: "" },
                    ...res.data.categories.map((cat: OptionType) => ({
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

    const handleSave = async () => {
        try {
            if (status !== "authenticated") return

            if (!sum) {
                toast.warning('ยังเลือกรายการไม่ครบ')
                return
            }

            const payload = {
                member_id: Number(selectedUser?.value),
                user_id: userId,
                product_id: Number(selectedProduct?.value),
                extra_percent: selectAddPercen,
                down_percent: Number(selectDown),
                installments_month: Number(selectIn)
            }
            const res = await api.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/create`, payload)
            console.log(res);
            if (res.status === 200) {
                toast.success('ทำรายการสำเร็จ')
                router.push('/member/rent')

            }

        } catch (error) {
            const resultt = await handleAxiosError(error)
            toast.error(resultt)
        }
    }


    useEffect(() => {
        fetchDataUser()
        fetchDataProduct()
        fetchDataCategory()
    }, [selectedCategory])



    useEffect(() => {
        let sum = 0
        let newSum = 0
        if (selectedUser && selectedProduct && selectAddPercen && selectDown && selectIn) {
            const basePrice = Number(selectedProduct.price);

            const processDown = basePrice + basePrice * (Number(selectAddPercen) / 100)
            const downPrice = ((processDown * Number(selectDown)) / 100)
            const sumCal = (processDown - downPrice) / Number(selectIn)
            const fixedSumString = sumCal.toFixed(2);
            const finalSum = parseFloat(fixedSumString);
            sum = Math.round(finalSum);
            newSum = processDown

        }
        setProductNewPrice(newSum)
        setSum(sum)

    }, [selectedUser, selectedProduct, selectAddPercen, selectDown, selectIn])

    return (
        <div className='flex flex-col md:flex-row gap-4'>
            <Card className='w-full md:w-4/6 h-full'>

                <h3 className='text-xl'>จัดการบิลผ่อน</h3>
                <div className='flex flex-col md:flex-row gap-4 mt-5'>
                    <div className="w-full ">
                        <label htmlFor="" className='text-sm text-dark-3   '>ค้นหาลูกค้า</label>
                        <SelectReact
                            options={optionUser}
                            value={selectedUser}
                            onChange={(newValue) => {
                                setSelectedUser(newValue as OptionType | null);
                            }}
                            isClearable
                            className='mt-2  '

                        />
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-4 mt-5'>
                    <div className="w-full sm:w-1/2">
                        <label htmlFor="" className='text-sm text-dark-3   '>ประเภทสินค้า</label>
                        <SelectReact
                            options={dataCategory}
                            value={selectedCategory}
                            onChange={(newValue) => {
                                setSelectedCategory(newValue as OptionType | null);
                            }}
                            isClearable
                            className='mt-2  '

                        />
                    </div>

                    <div className="w-full sm:w-1/2">
                        <label htmlFor="" className='text-sm text-dark-3   '>ค้นหาสินค้า</label>
                        <SelectReact
                            options={optionProduct}
                            value={selectedProduct}
                            onChange={(newValue) => {
                                setSelectedProduct(newValue as OptionType | null);
                            }}
                            isClearable
                            className='mt-2  '
                            isDisabled={!selectedCategory}
                        />
                    </div>
                </div>


                <div className='mt-5 flex flex-col md:flex-row gap-4'>
                    <InputGroup
                        label="เพิ่ม % เฉพาะบิล"
                        placeholder="0 %"
                        type="text"
                        className='w-full'
                        value={String(selectAddPercen)}
                        onChange={(e) => setSelectAddPercen(Number(e.target.value))}
                        maxLength={3}
                    />

                    <Select
                        label="เงินดาวน์ (%)"
                        items={[
                            { label: "เลือก", value: "" },
                            { label: "0%", value: "0" },
                            { label: "30%", value: "30" },
                            { label: "35%", value: "35" },
                            { label: "40%", value: "40" },
                            { label: "45%", value: "45" },
                            { label: "50%", value: "50" },
                            { label: "55%", value: "55" },
                            { label: "60%", value: "60" },
                        ]}
                        defaultValue=""
                        className='w-full'
                        value={selectDown}
                        onChange={async (val) => setSelectDown(val)}
                    />
                </div>

                <div className='mt-5 flex flex-col md:flex-row gap-4'>

                    <Select
                        label="ผ่อนชำระ"
                        items={[
                            { label: "เลือก", value: "" },
                            { label: "1 เดือน", value: "1" },
                            { label: "2 เดือน", value: "2" },
                            { label: "3 เดือน", value: "3" },
                            { label: "4 เดือน", value: "4" },
                            { label: "5 เดือน", value: "5" },
                            { label: "6 เดือน", value: "6" },
                            { label: "7 เดือน", value: "7" },
                            { label: "8 เดือน", value: "8" },
                            { label: "9 เดือน", value: "9" },
                            { label: "10 เดือน", value: "10" },
                            { label: "11 เดือน", value: "11" },
                            { label: "12 เดือน", value: "12" },
                        ]}
                        defaultValue=""
                        className='w-full'
                        value={selectIn}
                        onChange={async (val) => setSelectIn(val)}
                    />

                    <InputGroup
                        label="ค่างวด / เดือน"
                        placeholder="0.00"
                        type="text"
                        className='w-full'
                        value={`${Number(sum).toLocaleString() || 0} บาท`}
                        disabled
                    />
                </div>

                <div className='flex flex-row gap-4 justify-end mt-8'>
                    <Link href='/member/rent'> <Button label='ยกเลิก' variant="outlinePrimary" shape="rounded" className='h-10 ' /></Link>
                    <Button label='บันทึก' variant="primary" shape="rounded" className='h-10 ' onClick={handleSave} />

                </div>

            </Card>

            <Card className='w-full md:w-2/6'>
                <h3 className='text-xl'>รายละเอียด</h3>
                <div className='mt-4'>
                    {selectedProduct?.images ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API}${selectedProduct?.images}` || ""}
                            className="aspect-[6/5] w-full rounded-[5px] object-cover"
                            width={500}
                            height={500}
                            alt={""}
                            role="presentation"
                        />
                    ) : (
                        <Image
                            src={"/images/cover/cover-03.jpg"}
                            className="aspect-[6/5] w-full rounded-[5px] object-cover"
                            width={500}
                            height={500}
                            alt={""}
                            role="presentation"
                        />
                    )}
                </div>

                <ul className='text-end mt-4 text-lg'>
                    <li> <p>ราคามือถือ : {Number(selectedProduct?.price).toLocaleString() || "0.00"} บาท</p></li>
                    <li> <hr className='my-4' /></li>
                    <li> <p>ราคาสุทธิ : {Number(productNewPrice).toLocaleString() || 0} บาท</p></li>
                </ul>
            </Card>

        </div>
    )
}

export default AddRent

