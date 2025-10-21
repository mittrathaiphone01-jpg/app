'use client'
import { MessageOutlineIcon, TrashIcon } from '@/assets/icons'
import DialogMember from '@/components/dialogs/DialogMember'
import DialogProduct from '@/components/dialogs/DialogProduct'
import InputGroup from '@/components/FormElements/InputGroup'
import { Select } from '@/components/FormElements/select'
import { getInvoiceTableData } from '@/components/Tables/fetch'
import { DownloadIcon, PreviewIcon } from '@/components/Tables/icons'
import { InvoiceTable } from '@/components/Tables/invoice-table'
import { Button } from '@/components/ui-elements/button'
import Dialogs from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import TableDropdownMember from '@/components/ui/TableDropdownMember'
import { AlertConfirm, cn, formathDateThai } from '@/lib/utils'
import { dataCategoryType } from '@/type'
import { api } from '@/utils/api'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { PiMagnifyingGlass } from 'react-icons/pi'
import { toast } from 'react-toastify'

interface TableType {
  id: number;
  category: string;
  name: string;
  price: string
  sku: boolean
  images: imageType[]
}

interface imageType {
  id: number
  url: string
}



const AdminProduct = () => {

  // const data = await getInvoiceTableData();
  const [data, setData] = useState<TableType[]>([])
  const [id, setId] = useState<number | null>(null)
  const [searchName, setSearchName] = useState<string>("")
  const [searchSku, setSearchSku] = useState<string>("")
  const [category_id, setCategoryId] = useState("")
  const [dataCategory, setDataCategory] = useState<dataCategoryType[]>([])


  // Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalData, setTotalData] = useState(0)

  const [isOpen, setIsOpen] = useState(false)

  const { data: session, status } = useSession()
  const role = session?.user.role_id

  const openDialog = () => {
    setIsOpen(!isOpen)
  }


  const fetchData = async () => {
    try {
      const res = await api.get(`${process.env.NEXT_PUBLIC_API}/product/${process.env.NEXT_PUBLIC_V}/all`, {
        params: {
          page: page,
          limit: Number(process.env.NEXT_PUBLIC_LIMIT),
          search: searchName,
          sku: searchSku,
          sort_price: "",
          category_id: category_id

        }
      })
      console.log(res.data);
      if (res.status === 200) {
        setData(res.data.data)
        setCurrentPage(res.data.current_page)
        setTotalPage(res.data.total_pages)
        setTotalData(res.data.total)
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


  const handleEdit = (id: number) => {
    setId(id)
    openDialog()
  };

  const handleDelete = async (id: number, name: string) => {
    try {
      const alertResult = await AlertConfirm(`ลบข้อมูล - ${name || ""} `, 'ต้องการลบข้อมูลนี้หรือไม่ ?')
      if (!alertResult) return false

      const res = await api.delete(`${process.env.NEXT_PUBLIC_API}/product/${process.env.NEXT_PUBLIC_V}/${id}`)
      console.log(res);
      if (res.status === 204 || res.status === 200) {
        toast.success('ทำรายการสำเร็จ')
        await fetchData()
      }

    } catch (error) {
      console.log(error);

    }

  };



  useEffect(() => {
    if (status !== "authenticated") return
    fetchData()
    fetchDataCategory()
  }, [page, searchName, searchSku, session, category_id])


  return (
    <div>

      <DialogProduct
        isOpen={isOpen}
        openDialog={openDialog}
        id={id}
        fetchData={fetchData}
        role={role || undefined}
        setPage={setPage}

      />

      <div className='rounded-[10px] border border-stroke bg-white px-4 pb-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card  flex flex-col md:flex-row gap-4 justify-between items-end md:items-center '>
        <div className='flex gap-4'>
          <InputGroup
            label="ค้นหาจากชื่อสินค้า"
            placeholder="ค้นหาจากชื่อสินค้า"
            type="text"
            className='w-full'
            icon={<PiMagnifyingGlass />}
            iconPosition="left"
            value={searchName}
            onChange={(e) => {
              setPage(1)
              setSearchName(e.target.value)
            }}

          />

          <InputGroup
            label="ค้นหาจากรหัสสินค้า"
            placeholder="ค้นหาจากรหัสสินค้า"
            type="text"
            className='w-full'
            icon={<PiMagnifyingGlass />}
            iconPosition="left"
            value={searchSku}
            onChange={(e) => {
              setPage(1)
              setSearchSku(e.target.value)
            }}
          />

          <Select
            label="เลือกประเภท"
            items={dataCategory}
            defaultValue=""
            className='w-full'
            value={category_id}
            onChange={async (val) => setCategoryId(val)}
          />

        </div>

        <Button onClick={() => { openDialog(); setId(null) }} label="เพิ่มรายการ" variant="primary" shape="rounded" className='h-12 md:mt-4 text-xs md:text-base w-full md:w-fit' />
      </div>



      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5 mt-4   ">
        <div className='h-[500px] overflow-y-auto'>
          <Table className='  '>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead className="min-w-[155px] xl:pl-7.5">สินค้า</TableHead>
                <TableHead>รหัสสินค้า</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {data?.map((item, index) => (
                <TableRow key={index} className="border-[#eee] dark:border-dark-3">
                  <TableCell className="flex flex-col md:flex-row min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                    {item?.images?.length > 0 ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API}${item.images[0].url}` || ""}
                        className="aspect-[6/5] w-30 rounded-[5px] object-cover"
                        width={100}
                        height={100}
                        alt={"Image for product " + item.name}
                        role="presentation"
                      />
                    ) : (
                      <Image
                        src={"/images/cover/cover-03.jpg"}
                        className="aspect-[6/5] w-30 rounded-[5px] object-cover"
                        width={100}
                        height={100}
                        alt={"Image for product " + item.name}
                        role="presentation"
                      />
                    )}
                    <div><h2 className='text-sm md:text-lg'>{item.name}</h2></div>
                  </TableCell>


                  <TableCell>
                    <p className="text-dark dark:text-white">{item.sku}</p>
                  </TableCell>


                  <TableCell>
                    <p className="text-dark dark:text-white">{item.category}</p>
                  </TableCell>

                  <TableCell>
                    <p className="text-dark dark:text-white">{Number(item.price).toLocaleString()}</p>
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


    </div>
  )
}

export default AdminProduct

