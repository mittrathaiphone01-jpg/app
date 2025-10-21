'use client'
import DatePickerOne from '@/components/FormElements/DatePicker/DatePickerOne'
import InputGroup from '@/components/FormElements/InputGroup'
import { Button } from '@/components/ui-elements/button'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/utils/api'
import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { PiMagnifyingGlass } from 'react-icons/pi'

interface TableType {
  id: number
  invoice: string
  product_name: string
  paid_amount: string
  total_price: number
  late_day: number
  updated_at: string
  net_installment: number
  remaining_amount: number
  status: number
}


const MemberRent = () => {

  const [data, setData] = useState<TableType[]>([])
  const [search, setSearch] = useState<string>("")

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalData, setTotalData] = useState(0)
  const [sum_paid_amount , setSumPaidAmount] = useState(0)

  // search
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchNameTel, setSearchNameTel] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchData = async () => {
    try {
      const res = await api.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/all/unpaid`, {
        params: {
          page: page,
          limit: Number(process.env.NEXT_PUBLIC_LIMIT),
          search: search,
          sort: 1,
          date_from: startDate,
          date_to: endDate , 
          np : searchNameTel
        }
      })
      console.log(res.data);

      if (res.status === 200) {
        // pagination 
        setData(res.data.data)
        setCurrentPage(res.data.current_page)
        setTotalPage(res.data.total_pages)
        setTotalData(res.data.total)
        setSumPaidAmount(res.data.sum_paid_amount)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = (text: string) => {
    setSearchInput(text)
    setTimeout(async () => {
      setPage(1)
      setSearch(text)
    }, 500);
  }

  useEffect(() => {
    fetchData()
  }, [page, search, startDate, endDate, searchNameTel])


  return (
    <div>
      <div className='rounded-[10px] border border-stroke bg-white px-4 py-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card  flex flex-col md:flex-row gap-0 md:gap-4 justify-between items-center '>

        <div className='flex flex-col md:flex-row gap-4'>
          <DatePickerOne
            label="วันที่เริ่มต้น"
            name="start_date"
            onChange={(date) => setStartDate(date ? moment(date).format("YYYY-MM-DD") : "")}
            value={startDate}
          />
          <DatePickerOne
            label="วันที่สิ้นสุด"
            name="start_date"
            onChange={(date) => setEndDate(date ? moment(date).format("YYYY-MM-DD") : "")}
            value={endDate}
          />

          <InputGroup
            label="ค้นหาจากเลขที่บิล"
            placeholder="ค้นหาจากเลขที่บิล"
            type="text"
            className=''
            icon={<PiMagnifyingGlass />}
            iconPosition="left"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            maxLength={20}
          />

          <InputGroup
            label="ค้นหาจากชื่อและเบอร์โทร"
            placeholder="ค้นหาจากชื่อและเบอร์โทร"
            type="text"
            className=''
            icon={<PiMagnifyingGlass />}
            iconPosition="left"
            value={searchNameTel}
            onChange={(e) => setSearchNameTel(e.target.value)}
            maxLength={20}
          />


        </div>


        <Link href={`/member/rent/add`} >
          <Button label="เพิ่มรายการ" variant="primary" shape="rounded" className='h-10 mt-4  '  />
        </Link>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5 mt-6   ">
        <div className=' overflow-y-auto'>
          <Table className='  '>
            <TableHeader className=''>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white  ">
                <TableHead className="min-w-[155px] xl:pl-7.5 text-center">เลขที่บิล</TableHead>
                <TableHead className='text-center'>สินค้า</TableHead>
                <TableHead className='text-center '>ราคา/เดือน</TableHead>
                <TableHead className='text-center'>จ่ายแล้ว</TableHead>
                <TableHead className='text-center'>สถานะ</TableHead>
                <TableHead className='text-center'>รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.map((item, index) => (
                <TableRow key={index} className="border-[#eee] dark:border-dark-3 text-center">
                  <TableCell className="min-w-[155px] ">
                    <h5 className="text-dark dark:text-white">{item.invoice}</h5>
                  </TableCell>

                  <TableCell className="min-w-[155px] ">
                    <p className="text-dark dark:text-white">{item.product_name}</p>
                  </TableCell>

                  <TableCell className="min-w-[155px] ">
                    <p className="text-dark dark:text-white">{Number(item.net_installment).toLocaleString()} ฿</p>
                  </TableCell>

                  <TableCell className="min-w-[155px] ">
                    <p className="text-dark dark:text-white">{`${Number(item.paid_amount).toLocaleString()} / ${Number(item.total_price).toLocaleString()}`} ฿</p>
                  </TableCell>
                  <TableCell className="min-w-[120px] ">
                    <p className={`text-dark dark:text-white ${item?.status === 0 ? "bg-red-200" : item?.status === 1 ? "bg-yellow-200/60" : ""} rounded-sm `}>
                      {item?.status === 0 ? "ยกเลิกบิล" : item?.status === 1 ? "กำลังจ่าย" : "-"}
                    </p>
                  </TableCell>

                  <TableCell className="min-w-[200px] ">
                    <Link href={`/member/rent/${item.id}`} className=''>
                      <Button label='รายละเอียด' variant="primary" shape="rounded" className='h-8 ' />
                    </Link>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          totalData={totalData}
          onPageChange={(p) => setPage(p)}
          className="mt-4 flex justify-end"
          sum_paid_amount={sum_paid_amount}
        />
      </div>
    </div>
  )
}

export default MemberRent



