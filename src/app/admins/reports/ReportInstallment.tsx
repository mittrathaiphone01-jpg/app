'use client'
import { EmailIcon, SearchIcon } from '@/assets/icons'
import DatePickerOne from '@/components/FormElements/DatePicker/DatePickerOne'
import InputGroup from '@/components/FormElements/InputGroup'
import { MenuIcon } from '@/components/Layouts/header/icons'
import { PreviewIcon } from '@/components/Tables/icons'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, formathDateThai } from '@/lib/utils'
import { api } from '@/utils/api'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { PiMagnifyingGlass } from 'react-icons/pi'
import { CiBoxList } from "react-icons/ci";
import ReportDetails from '@/components/Modals/ReportDetails'
import { Button } from '@/components/ui-elements/button'


interface dataType {
  id: number
  invoice: string
  product_name: string
  paid_amount: string
  total_price: number
  late_day: number
  updated_at: string
  down_percent: number
  fee_amount : number
}

interface proptype {
  page: number
}

const ReportInstallment = ({ page }: proptype) => {

  const [data, setData] = useState<dataType[]>([])
  const [paid_bill_count, setPaidBullCount] = useState(0)
  const [unpaid_bill_count, setUnpaidBillCount] = useState(0)
  const [total, setTotal] = useState(0)

  // Pagination
  const [myPage, setMyPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalData, setTotalData] = useState(0)

  // Search
  const [search, setSearch] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bill_id, setBill_id] = useState<number | null>(null)

  // Headeer
  const [sum_paid_amount, setSumPaidAmount] = useState(0)
  const [sum_fee_amount, setSumFreeAmount] = useState(0)

  const openModal = (id: number) => {
    setIsModalOpen(true);
    setBill_id(id)
  }
  const closeModal = () => setIsModalOpen(false);

  const fetchData = async () => {

    try {
      const res = await api.get(`${process.env.NEXT_PUBLIC_API}/bill/${process.env.NEXT_PUBLIC_V}/all`, {
        params: {
          page: myPage,
          limit: Number(process.env.NEXT_PUBLIC_LIMIT),
          date_from: startDate,
          date_to: endDate,
          search: search
        }
      })
      console.log(res.data);

      if (res.status === 200) {
        setSumPaidAmount(res.data.sum_paid_amount)
        setSumFreeAmount(res.data.sum_fee_amount)
        setTotal(res.data.total)

        // pagination 
        setData(res.data.data)
        setCurrentPage(res.data.current_page)
        setTotalPage(res.data.total_pages)
        setTotalData(res.data.total)
      }
    } catch (error) {
      console.log(error);

    }
  }


  useEffect(() => {
    if (page === 1) fetchData()
  }, [page, startDate, endDate, search, myPage])


  return (
    <div>

      {/* Modal */}
      {isModalOpen && bill_id && (
        <ReportDetails
          isOpen={isModalOpen}
          onClose={closeModal}
          bill_id={bill_id}
          type={1}
        />
      )}

      <div className='flex flex-col md:flex-row gap-3'>
        <Card className='w-full '>
          <h2 className='text-2xl flex gap-2 items-center'> <PreviewIcon /> ยอดที่ชำระแล้ว</h2>
          <p className='text-end mt-4 text-2xl'>{Number(sum_paid_amount).toLocaleString()} <span className='text-base'>บาท</span></p>
        </Card>
        <Card className='w-full '>
          <h2 className='text-2xl flex gap-2 items-center'> <MenuIcon /> ค่าปรับ</h2>
          <p className='text-end mt-4 text-2xl'> {Number(sum_fee_amount).toLocaleString()} <span className='text-base'>บาท</span></p>
        </Card>
        <Card className='w-full '>
          <h2 className='text-2xl flex gap-2 items-center'> <SearchIcon /> จำนวนทั้งหมด</h2>
          <p className='text-end mt-4 text-2xl'> {Number(total).toLocaleString()} <span className='text-base'>รายการ</span></p>
        </Card>
      </div>

      <div className=' mt-4 bg-white  px-4 py-4 rounded-md shadow-sm'>
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
            label="ค้นหาเลขบิล"
            placeholder="ค้นหาจากชื่อ"
            type="text"
            className=''
            icon={<PiMagnifyingGlass />}
            iconPosition="left"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxLength={20}
          />
        </div>

        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5 mt-6   ">
          <div className=' overflow-y-auto'>
            <Table className='  '>
              <TableHeader>
                <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                  <TableHead className="min-w-[155px] xl:pl-7.5">เลขที่บิล</TableHead>
                  <TableHead className='text-center'>สินค้า</TableHead>
                  <TableHead className='text-center'>ยอดรวม</TableHead>
                  <TableHead className='text-center'>เงินดาวน์</TableHead>
                  <TableHead className='text-center'>ยอดจัด</TableHead>
                  <TableHead className='text-center'>ค่าปรับ</TableHead>
                  <TableHead className='text-center'>ยอดสุทธิ</TableHead>
                  <TableHead className='text-center'>รายละเอียด</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.map((item, index) => {
                  const downCal = (Number(item.total_price) * Number(item.down_percent)) / 100
                  const debtCal = Number(item.total_price) - downCal
                  const sunCal = downCal + debtCal + Number(item.fee_amount)
                  return (
                    <TableRow key={index} className="border-[#eee] dark:border-dark-3">
                      <TableCell className="min-w-[155px] xl:pl-7.5">
                        <h5 className="text-dark dark:text-white">{item.invoice}</h5>
                      </TableCell>

                      <TableCell className='min-w-[120px] text-center'>
                        <p className="text-dark dark:text-white">{item.product_name}</p>
                      </TableCell>

                      <TableCell className='min-w-[120px] text-center'>
                        <p className="text-dark dark:text-white">{Number(item.total_price).toLocaleString()}</p>
                      </TableCell>

                      <TableCell className='min-w-[120px] text-center'>
                        <p className="text-dark dark:text-white">{Number(downCal).toLocaleString()}</p>
                      </TableCell>


                      <TableCell className='min-w-[120px] text-center'>
                        <p className="text-dark dark:text-white">{Number(item.paid_amount).toLocaleString()}</p>
                      </TableCell>

                      <TableCell className='min-w-[120px] text-center'>
                        <p className="text-dark dark:text-white">{Number(item.fee_amount).toLocaleString()}</p>
                      </TableCell>

                      <TableCell className='min-w-[120px] text-center'>
                        <p className="text-dark dark:text-white">{Number(sunCal).toLocaleString()}</p>
                      </TableCell>

                      <TableCell className='min-w-[120px] flex justify-center'>
                        <CiBoxList size={25}
                          className='hover:bg-gray-200 rounded-full hover:p-0.5 cursor-pointer active:bg-gray-300'
                          onClick={() => (openModal(item.id))}
                        />
                      </TableCell>

                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <Pagination
            currentPage={myPage}
            totalPages={totalPage}
            totalData={totalData}
            onPageChange={(p) => setMyPage(p)}
            className="mt-4 flex justify-end"
          />
        </div>

      </div>
      
    </div>
  )
}

export default ReportInstallment

