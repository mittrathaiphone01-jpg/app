'use client'
import Card from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const CheckUserPage = () => {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(1)

    const router = useRouter();


    useEffect(() => {
        // URL สำหรับเริ่มต้น LINE Login
        const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2008169913&redirect_uri=https://app-scgp.thaibusinessmate.com/check-user/success&state=RANDOM_STRING&scope=profile%20openid`;

        // Redirect ไปที่ URL ของ LINE Login
        window.location.href = lineLoginUrl;
    }, []);



    return (
        <>

            <div>
                <h1>กำลังเชื่อมโยงบัญชี</h1>
                <p>กรุณารอสักครู่...</p>
            </div>

     
        </>
    )
}

export default CheckUserPage