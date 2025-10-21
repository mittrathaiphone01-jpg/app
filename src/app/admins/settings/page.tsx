'use client'
import { DribbleIcon } from '@/app/profile/_components/icons'
import { CloseIcon } from '@/assets/icons'
import { MenuIcon } from '@/components/Layouts/header/icons'
import { Button } from '@/components/ui-elements/button'
import React, { useState } from 'react'
import SettingInstallment from './SettingInstallment'
import SettingRental from './SettingRental'

const AdminSettings = () => {
    const [page, setPage] = useState(1)
    const handleChangePage = (page: number) => {
        setPage(page)
    }
    return (
        <div>
            <div className='flex flex-row gap-4'>
                <Button label='ตั้งค่า (ผ่อน)' variant={`${page === 1 ? "primary" : "outlinePrimary"}`} shape="rounded" size="small" icon={<DribbleIcon />} onClick={() => handleChangePage(1)} />
                <Button label='ตั้งค่า (ไอโฟนแลกเงิน)' variant={`${page === 2 ? "primary" : "outlinePrimary"}`} shape="rounded" size="small" icon={<MenuIcon />} onClick={() => handleChangePage(2)} />
            </div>

            <div className='my-5'>
                {page === 1 ?
                    <SettingInstallment />
                    : page === 2 ?
                        <SettingRental />
                        : ""
                }
            </div>
        </div>
    )
}

export default AdminSettings