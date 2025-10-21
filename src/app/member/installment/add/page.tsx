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
    day: number

};

const AddInstallment = ({ }: BlogPageProps) => {

    const { data: session, status } = useSession()
    const userId = session?.user.id

    const router = useRouter()

    const [optionUser, setOptionUser] = useState<OptionType[]>([]);
    const [optionProduct, setOptionProduct] = useState<OptionType[]>([]);
    const [optionDay, setOptionDay] = useState<OptionType[]>([]);
    const [selectedUser, setSelectedUser] = useState<SingleValue<OptionType>>(null);
    const [selectedProduct, setSelectedProduct] = useState<SingleValue<OptionType>>(null);
    const [selectedDay, setSelectedDay] = useState<SingleValue<OptionType>>(null);
    const [selectType, setSelectType] = useState<string>("");
    const [loan_amount, setLoanAmount] = useState(0)

    const [selectDown, setSelectDown] = useState("")
    const [selectIn, setSelectIn] = useState("")
    const [sum, setSum] = useState(0)
    const [selectAddPercen, setSelectAddPercen] = useState(0)

    const [dataCategory, setDataCategory] = useState<dataCategoryType[]>([])
    const [selectedCategory, setSelectedCategory] = useState<SingleValue<OptionType>>(null);

    // Show Data Nobile
    const [productNewPrice, setProductNewPrice] = useState(0)
    const [rentalPrice, setRentalPrice] = useState(0)
    const [interest, setInterest] = useState(0)
    const [allSum, setAllSum] = useState(0)


    const fetchDataUser = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/members/${process.env.NEXT_PUBLIC_V}/all`)
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
                params : {
                    category_id: Number(selectedCategory?.value) || ""
                }
            })
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

    const fetchDataDay = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/installments/${process.env.NEXT_PUBLIC_V}/all`)
            if (res.status === 200) {
                const opts: OptionType[] = res.data.map((item: OptionType) => ({
                    value: item.id,
                    label: `${item.day} เดือน`,
                    day: item.day
                }))
                setOptionDay(opts)
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


            if (!loan_amount || !selectType) {
                toast.warning('ยังเลือกรายการไม่ครบ')
                return
            }

            if (selectType === "2") {
                if (!selectAddPercen || selectedDay?.day === undefined) {
                    toast.warning('ยังเลือกรายการไม่ครบ')
                    return
                }
            }

            const interest_amount_cal = ((loan_amount * 10) / 100)
            const payload = {
                member_id: Number(selectedUser?.value),
                user_id: userId,
                product_id: Number(selectedProduct?.value),
                extra_percent: selectType === "1" ? 0 : selectAddPercen,
                installment_id: selectType === "1" ? 0 : Number(selectedDay?.value),
                loan_amount: loan_amount,
                term_type: Number(selectType),
                term_value: selectType === "1" ? 10 : 0,
                interest_amount: selectType === "1" ? interest_amount_cal : 0

            }

            console.log(payload);

            const res = await api.post(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/create/in`, payload)
            console.log(res);
            if (res.status === 200) {
                toast.success('ทำรายการสำเร็จ')
                router.push('/member/installment')

            }

        } catch (error) {
            const resultt = await handleAxiosError(error)
            toast.error(resultt)
        }
    }


    useEffect(() => {
        fetchDataUser()
        fetchDataProduct()
        fetchDataDay()
        fetchDataCategory()
    }, [selectedCategory])



    useEffect(() => {
        let interest = 0
        let allSum = 0
        console.log(selectedDay?.day);

        if (selectedUser && selectedProduct && loan_amount && selectType) {

            if (selectType === "1") {
                interest = (Number(loan_amount) * 10) / 100
                allSum = Number(loan_amount) + Number(interest)

            } else if (selectType === "2") {
                if (selectAddPercen && selectedDay?.day) {
                    interest = (Number(loan_amount) * Number(selectAddPercen)) / 100
                    allSum = Number(loan_amount) + interest
                }
            }

        }
        setInterest(interest)
        setAllSum(allSum)





    }, [selectedUser, selectedProduct, selectAddPercen, selectedDay])

    return (
        <div className='flex flex-col md:flex-row gap-4'>
            <Card className='w-full md:w-4/6 h-full'>

                <h3 className='text-xl'>จัดการบิลเช่า</h3>
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

                    {/* <div className="w-full sm:w-1/2">
                        <label htmlFor="" className='text-sm text-dark-3   '>ค้นหาสินค้า</label>
                        <SelectReact
                            options={optionProduct}
                            value={selectedProduct}
                            onChange={(newValue) => {
                                setSelectedProduct(newValue as OptionType | null);
                            }}
                            isClearable
                            className='mt-2  '
                        />
                    </div> */}
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
                        label="ยอดที่ต้องการ"
                        placeholder="0.00"
                        type="number"
                        className='w-full '
                        value={String(loan_amount)}
                        onChange={(e) => {
                            if (Number(e.target.value) > Number(selectedProduct?.price)) {
                                toast.error('ห้ามกรอกมากกว่าราคามือถือ !!');
                                setLoanAmount(0);
                                return;
                            }
                            setLoanAmount(Number(e.target.value))
                        }}
                        maxLength={3}
                        disabled={!selectedProduct}
                    />

                    <div className="w-full ">
                        <Select
                            label="เลือกประเภท"
                            items={[
                                { label: "เลือก", value: "" },
                                { label: "ราย 10 วัน", value: "1" },
                                { label: "รายเดือน", value: "2" },
                            ]}
                            defaultValue=""
                            className='w-full'
                            value={selectType}
                            onChange={async (val) => {
                                setSelectType(val)
                                if (val === "1") {
                                    setSelectAddPercen(10)
                                }
                                else {
                                    setSelectAddPercen(0)
                                    setSelectedDay(null)
                                }
                            }}
                            disabled={!selectedProduct}

                        />
                    </div>
                </div>

                <hr className='my-6' />
                <h3 className='text-lg text-dark-2 dark:text-dark-8'>ตั้งค่าเพิ่มเติม</h3>


                <div className='mt-5 flex flex-col md:flex-row gap-4'>
                    <InputGroup
                        label="เปอร์เซ็นต์ เฉพาะบิล"
                        placeholder="0 %"
                        type="text"
                        className='w-full '
                        value={String(selectAddPercen)}
                        onChange={(e) => setSelectAddPercen(Number(e.target.value))}
                        maxLength={3}
                        disabled={selectType == "" || selectType === "1"}
                    />

                    <div className="w-full ">
                        <label htmlFor="" className='text-sm text-dark-3   '>ระยะเวลาทั้งหมด</label>
                        <SelectReact
                            options={optionDay}
                            value={selectedDay}
                            onChange={(newValue) => {
                                setSelectedDay(newValue as OptionType | null);
                            }}
                            isClearable
                            className='mt-2   '
                            defaultValue={'เลือก'}
                            isDisabled={selectType == "" || selectType === "1"}
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-4 justify-end mt-8'>
                    <Link href='/member/installment'> <Button label='ยกเลิก' variant="outlinePrimary" shape="rounded" className='h-10 ' /></Link>
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
                            width={100}
                            height={100}
                            alt={""}
                            role="presentation"
                        />
                    ) : (
                        <Image
                            src={"/images/cover/cover-03.jpg"}
                            className="aspect-[6/5] w-full rounded-[5px] object-cover"
                            width={100}
                            height={100}
                            alt={""}
                            role="presentation"
                        />
                    )}
                </div>

                <ul className='text-end mt-4 text-lg'>
                    <li> <p>ราคามือถือ : {
                        !isNaN(Number(selectedProduct?.price))
                            ? Number(selectedProduct?.price)?.toLocaleString()
                            : 0} บาท</p>
                    </li>
                    <li> <hr className='my-4' /></li>

                    <li> <p>ดอกเบี้ยที่งหมด : {Number(interest).toLocaleString() || 0} บาท</p></li>
                    <li> <p>ยอดชำระสุทธิ : {Number(allSum).toLocaleString() || 0} บาท</p></li>

                </ul>
            </Card>

        </div>
    )
}

export default AddInstallment

