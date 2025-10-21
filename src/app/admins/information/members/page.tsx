'use client'
import { MessageOutlineIcon, TrashIcon } from '@/assets/icons'
import DialogMember from '@/components/dialogs/DialogMember'
import InputGroup from '@/components/FormElements/InputGroup'
import { getInvoiceTableData } from '@/components/Tables/fetch'
import { DownloadIcon, PreviewIcon } from '@/components/Tables/icons'
import { InvoiceTable } from '@/components/Tables/invoice-table'
import { Button } from '@/components/ui-elements/button'
import Dialogs from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import TableDropdownMember from '@/components/ui/TableDropdownMember'
import { AlertConfirm, cn, formathDateThai } from '@/lib/utils'
import { api } from '@/utils/api'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { PiMagnifyingGlass } from 'react-icons/pi'
import { toast } from 'react-toastify'

interface TableType {
  id: number;
  full_name: string;
  tel: string;
  username: string
  is_active: boolean
}



const AdminMember = () => {

  // const data = await getInvoiceTableData();
  const [data, setData] = useState<TableType[]>([])
  const [id, setId] = useState<number | null>(null)
  const [search, setSearch] = useState<string>("")
  const [searchInput, setSearchInput] = useState<string>("")



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
      const res = await api.get(`${process.env.NEXT_PUBLIC_API}/users/${process.env.NEXT_PUBLIC_V}/all`, {
        params: {
          page: page,
          limit: Number(process.env.NEXT_PUBLIC_LIMIT),
          search: search
        }
      })
      console.log(res.data);
      if (res.status === 200) {
        setData(res.data.data)
        setCurrentPage(res.data.pagination.current_page)
        setTotalPage(res.data.pagination.total_pages)
        setTotalData(res.data.pagination.total_users)
      }

    } catch (error) {
      console.log(error);

    }
  }


  const handleEdit = (id: number) => {
    setId(id)
    openDialog()
  };

  const handleDelete = async (id: number, full_name: string) => {
    try {
      const alertResult = await AlertConfirm(`ลบข้อมูล - ${full_name || ""} `, "ต้องการลบข้อมูลนี้หรือไม่ ?")
      if (!alertResult) return false

      const res = await api.delete(`${process.env.NEXT_PUBLIC_API}/users/${process.env.NEXT_PUBLIC_V}/${id}`)
      console.log(res);
      if (res.status === 204) {
        toast.success('ทำรายการสำเร็จ')
        await fetchData()
      }

    } catch (error) {
      console.log(error);

    }

  };

  const handleSearch = (text: string) => {
    setSearchInput(text)
    setTimeout(async () => {
      setPage(1)
      setSearch(text)
    }, 500);
  }



  useEffect(() => {
    fetchData()
  }, [page, search])


  return (
    <div>

      <DialogMember
        isOpen={isOpen}
        openDialog={openDialog}
        id={id}
        fetchData={fetchData}
        setPage={setPage}

      />

      <div className='rounded-[10px] border border-stroke bg-white px-4 pb-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card  flex flex-col md:flex-row gap-4 justify-between items-center '>
        <InputGroup
          label=""
          placeholder="ค้นหาจากชื่อ"
          type="text"
          className=''
          icon={<PiMagnifyingGlass />}
          iconPosition="left"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          maxLength={20}
        />

        <Button onClick={() => { openDialog(); setId(null) }} label="เพิ่มรายการ" variant="primary" shape="rounded" className='h-10 mt-4' icon={<IoIosAddCircleOutline size={20} />} />
      </div>



      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5 mt-4   ">
        <div className=' overflow-y-auto'>
          <Table className='  '>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead className="min-w-[155px] xl:pl-7.5">ชื่อ-สกุล</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} className="border-[#eee] dark:border-dark-3">
                  <TableCell className="min-w-[155px] xl:pl-7.5">
                    <h5 className="text-dark dark:text-white">{item.full_name}</h5>
                  </TableCell>


                  <TableCell>
                    <p className="text-dark dark:text-white">{item.username}</p>
                  </TableCell>

                  <TableCell>
                    <div
                      className={cn(
                        "w-27 md:max-w-fit  rounded-full px-3.5 py-1 md:text-sm font-medium text-center",
                        {
                          "bg-[#219653]/[0.08] text-[#219653]":
                            item.is_active === true,
                          "bg-[#D34053]/[0.08] text-[#D34053]":
                            item.is_active === false,
                        },
                      )}
                    >
                      {item.is_active === true ? "ออนไลน์" : "ออกจากระบบ"}
                    </div>
                  </TableCell>
                  <TableCell className="xl:pr-7.5">
                    <div className="flex items-center justify-end gap-x-3.5">
                      <TableDropdownMember
                        onEdit={() => handleEdit(item.id )}
                        onDelete={() => handleDelete(item.id, item.full_name)}
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

export default AdminMember