'use client'
import React, { useEffect, useState } from 'react'
import StartPage from './StartPage';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/utils/api';

const PageSuccess = () => {

    // const searchParams = useSearchParams()
    // const router = useRouter()

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('กำลังตรวจสอบข้อมูล...');

    // Fake Data
    const checkStatus = true
    const currentUserId = "Uf897386f9b1444cccab1be76a126de54"
    useEffect(() => { 
        setLoading(false)
    }, [])

    // const [checkStatus, setCheckSatus] = useState(false)
    // const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // useEffect(() => {
    //     // ตรวจสอบว่ามีค่า code ใน URL หรือไม่
    //     const code = searchParams.get("code");
    //     if (code) {
    //         const fetchUserIdAndCheck = async () => {
    //             try {
    //                 // 1. ส่ง code ไปแลกเป็น access token
    //                 const tokenRes = await fetch(`/api/line/get-access-token?code=${code}`);
    //                 const tokenData = await tokenRes.json();

    //                 if (tokenData.access_token) {
    //                     // 2. ใช้ access token เพื่อดึงข้อมูลโปรไฟล์
    //                     const profileRes = await fetch(`https://api.line.me/v2/profile`, {
    //                         headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    //                     });
    //                     const profileData = await profileRes.json();

    //                     const userId = profileData.userId;
    //                     if (userId) {
    //                         setCurrentUserId(userId);
    //                         setStatus('พบ User ID, กำลังตรวจสอบในระบบ...');

    //                         const res = await api.post(`${process.env.NEXT_PUBLIC_API}/members/${process.env.NEXT_PUBLIC_V}/checking`, {
    //                             user_id: userId
    //                         })
    //                         if (res.status === 200) {
    //                             setStatus('การตรวจสอบเสร็จสิ้น!');
    //                             setCheckSatus(res.data.data)
    //                         }
    //                     } else {
    //                         setStatus('ไม่พบ User ID จาก LINE');
    //                     }
    //                 } else {
    //                     setStatus('ไม่สามารถแลก access token ได้');
    //                     router.push('/check-user')
    //                 }
    //             } catch (error) {
    //                 console.error('เกิดข้อผิดพลาด:', error);
    //                 setStatus('เกิดข้อผิดพลาดในการตรวจสอบ');
    //             } finally {
    //                 setLoading(false);
    //             }
    //         };

    //         fetchUserIdAndCheck();
    //     } else {
    //         // กรณีไม่มี code ใน URL
    //         setStatus('ไม่พบรหัสยืนยันจาก LINE');
    //         setLoading(false);
    //         router.push('/check-user')
    //     }
    // }, [searchParams]);

    return (
        <div>
            {loading ? (
                <p>{status}</p>
            ) : (
                <StartPage
                    currentUserId={currentUserId}
                    checkStatus={checkStatus}
                />
            )}

        </div>
    );
};

export default PageSuccess;