'use client';
import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import { handleAxiosError } from '@/utils/api';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button } from '@/components/ui-elements/button';
import jwt from 'jsonwebtoken';
import Relax from './pages/Relax';
import Hire from './pages/Hire';
import { DribbleIcon } from '../profile/_components/icons';
import { MenuIcon } from '@/components/Layouts/header/icons';


const MyPayClient = () => {

    const searchParams = useSearchParams();
    const lineUserId = searchParams.get('user_id');
    const [page, setPage] = useState(1)
    const [user_id, setUserId] = useState("")

    if (!lineUserId) {
        return (
            <div className='flex justify-center items-center h-screen '>
                <Card className='w-1/3 text-center text-2xl text-dark-2 '>
                    ไม่พบข้อมูล ......
                </Card>
            </div>
        )
    }
    const handleChangePage = (page: number) => {
        setPage(page)
    }

    const handleDecodeJwtToken = async () => {
        try {
            const res = await axios.post(`/api/payment/decode-token`, { token: lineUserId })
            console.log(res.data.data);
            if (res.status === 200) {
                
                if (res.data.data.userId || res.data.data.user_id) {
                    setUserId(res.data.data.userId || res.data.data.user_id)
                }
            }

        } catch (error) {
            console.log(error);

        }

    }

    useEffect(() => {
        if (lineUserId) {
            handleDecodeJwtToken()
        }
    }, [lineUserId])

    return (
        <div className='p-4 mx-auto container'>
            <div className='flex flex-row gap-4 mb-4'>
                <Button label='รายการ (ผ่อน)' variant={`${page === 1 ? "primary" : "outlinePrimary"}`} shape="rounded" size="small" icon={<DribbleIcon />} onClick={() => handleChangePage(1)} />
                <Button label='รายการ (ไอโฟนแลกเงิน)' variant={`${page === 2 ? "primary" : "outlinePrimary"}`} shape="rounded" size="small" icon={<MenuIcon />} onClick={() => handleChangePage(2)} />
            </div>
            {user_id && page === 1 ? <Relax lineUserId={user_id} /> : user_id && page === 2 ? <Hire lineUserId={user_id} /> : ""}
        </div>

    )
}

export default MyPayClient