'use client'
import { MessageOutlineIcon, TrashIcon } from '@/assets/icons'
import DialogMember from '@/components/dialogs/DialogMember'
import InputGroup from '@/components/FormElements/InputGroup'
import { getInvoiceTableData } from '@/components/Tables/fetch'
import { DownloadIcon, PreviewIcon } from '@/components/Tables/icons'
import { InvoiceTable } from '@/components/Tables/invoice-table'
import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import Dialogs from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import TableDropdownMember from '@/components/ui/TableDropdownMember'
import { AlertConfirm, cn, formathDateThai } from '@/lib/utils'
import { api, handleAxiosError } from '@/utils/api'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { PiMagnifyingGlass } from 'react-icons/pi'
import { toast } from 'react-toastify'

interface TableType {
    id: number;
    name: string;

}


const ProductType = () => {
    const { data: session, status } = useSession()
    const role = session?.user.role_id
    console.log({ role });


    const [data, setData] = useState<TableType[]>([])
    const [id, setId] = useState<number | null>(null)
    const [search, setSearch] = useState<string>("")
    const [name, setName] = useState<string>("")



    // Pagination
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalData, setTotalData] = useState(0)

    const [isOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(!isOpen)
    }

    const fetchData = async () => {
        try {
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/product-category/${process.env.NEXT_PUBLIC_V}/all`, {
                params: {
                    page
                }
            })
            console.log(res.data);

            if (res.status === 200) {
                setData(res.data.categories)
                setCurrentPage(res.data.current_page)
                setTotalPage(res.data.total_pages)
                setTotalData(res.data.total)
            }

        } catch (error) {
            console.log(error);

        }
    }




    const handleEdit = async (id: number) => {
        try {
            if (!id) {
                toast.error('ไม่พบ ID')
                return
            }
            const res = await api.get(`${process.env.NEXT_PUBLIC_API}/product-category/${process.env.NEXT_PUBLIC_V}/${id}`)

            if (res.status === 200) {
                setName(res.data.name)
                setId(res.data.id)
            }

        } catch (error) {
            console.log(error);

        }
    }

    const handleDelete = async (id: number, name : string) => {
        try {
            const alertResult = await AlertConfirm(`ลบข้อมูล - ${name || ""} `, 'ต้องการลบข้อมูลนี้หรือไม่ ?')
            if (!alertResult) return false

            const res = await api.delete(`${process.env.NEXT_PUBLIC_API}/product-category/${process.env.NEXT_PUBLIC_V}/${id}`)
            console.log(res);
            if (res.status === 204) {
                toast.success('ทำรายการสำเร็จ')
                await fetchData()
            }

        } catch (error) {
            console.log(error);

        }

    };

    const handleSave = async () => {
        try {
            if (!name) {
                toast.error('กรอกข้อมูลไม่ครบ !')
                return
            }
            const payload = {
                name
            }
            if(data.length >= 5){
                toast.error('มีข้อมูลครบ 5 รายการแล้ว ไม่สามารถเพิ่มได้')
                return
            }

            if (!id) {
                const res = await api.post(`${process.env.NEXT_PUBLIC_API}/product-category/${process.env.NEXT_PUBLIC_V}/create`, payload)
                console.log(res);

                if (res.status === 200 || res.status === 201) {
                    toast.success('ทำรายการสำเร็จ')
                    await fetchData()
                    setName("")
                    setPage(1)
                }
            } else {
                const res = await api.put(`${process.env.NEXT_PUBLIC_API}/product-category/${process.env.NEXT_PUBLIC_V}/${id}`, payload)
                console.log(res);
                if (res.status === 200 || res.status === 201) {
                    toast.success('ทำรายการสำเร็จ ')
                    await fetchData()
                    setName("")
                    setId(null)
                }

            }

        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)
            setName("")
            setId(null)

        }
    }


    useEffect(() => {
        if (status !== "authenticated") return
        fetchData()
    }, [page, session])


    return (
        <div>
            <section className='flex flex-col md:flex-row gap-4 mt-4'>
                <Card className='w-full md:w-1/3'>
                    <InputGroup
                        label="ชื่อ-ประเภทสินค้า"
                        placeholder="กรอกชื่อ-ประเภทสินค้า"
                        type="text"
                        className=''
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={20}
                    />
                    <div className='flex flex-row gap-2'>
                        <Button onClick={handleSave}
                            label={`${!id ? "บันทึก" : "อัพเดท"}`}
                            variant="primary" shape="rounded" className='h-10 mt-4 w-full' />
                        <Button onClick={()=> {
                            setName("")
                            setId(null)
                        }}
                            label={`ยกเลิก`}
                            variant="outlinePrimary" shape="rounded" className='h-10 mt-4 w-full' />
                    </div>
                    <h2 className='text-sm text-red-500 text-start mt-2'>*เพิ่มได้ทั้งหมด 5 รายการเท่านั้น </h2>

                </Card>
                <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5   w-full md:w-2/3  ">

                    <div className=' overflow-y-auto mt-4'>
                        <Table className=' border border-gray-200 rounded-md  '>
                            <TableHeader>
                                <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                                    <TableHead className="min-w-[155px] xl:pl-7.5">#</TableHead>
                                    <TableHead>ชื่อ</TableHead>
                                    <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.map((item, index) => (
                                    <TableRow key={index} className="border-[#eee] dark:border-dark-3">

                                        <TableCell>
                                            <p className="text-dark dark:text-white">{index + 1}</p>
                                        </TableCell>

                                        <TableCell className="min-w-[155px] xl:pl-7.5">
                                            <h5 className="text-dark dark:text-white">{item.name}</h5>
                                        </TableCell>
                                        <TableCell className="xl:pr-7.5">
                                            <div className="flex items-center justify-end gap-x-3.5">
                                                <TableDropdownMember
                                                    onEdit={() => handleEdit(item.id)}
                                                    onDelete={() => {
                                                        if (role === 1) {
                                                            handleDelete(item.id, item.name)
                                                        } else {
                                                            toast.error('ไม่มีสิทธิ์ลบ')
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPage}
                        totalData={totalData}
                        onPageChange={(p) => setPage(p)}
                        className="mt-4 flex justify-end"
                    />
                </div>
            </section>




        </div>
    )
}

export default ProductType


