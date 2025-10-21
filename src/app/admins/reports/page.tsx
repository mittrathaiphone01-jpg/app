'use client'
import { DribbleIcon } from '@/app/profile/_components/icons'
import { MenuIcon } from '@/components/Layouts/header/icons'
import { SettingsIcon } from '@/components/Layouts/header/user-info/icons'
import { Button } from '@/components/ui-elements/button'
import React, { useState } from 'react'
import { FaIcons } from 'react-icons/fa'
import ReportRent from './ReportRent'
import ReportInstallment from './ReportInstallment'


const AdminReport = () => {

    const [page, setPage] = useState<number>(1)


    const handleChangePage = (page: number) => {
        setPage(page)
    }

    return (
        <div>
            <div className='flex flex-col md:flex-row gap-4'>
                <Button label='รายงาน ผ่อน' variant={`${page === 1 ? "primary" : "outlinePrimary"}`} shape="rounded" size="small" icon={<SettingsIcon />} onClick={() => handleChangePage(1)} />
                <Button label='รายงาน ไอโฟนแลกเงิน' variant={`${page === 2 ? "primary" : "outlinePrimary"}`} shape="rounded" size="small" icon={<MenuIcon />} onClick={() => handleChangePage(2)} />
            </div>

            <div className='my-5'>
                {page === 1 ?
                    <ReportInstallment page={page} />
                    : page === 2 ?
                        <ReportRent page={page} />

                        : ""
                }
            </div>

        </div>
    )
}

export default AdminReport