
import React, { Suspense } from 'react'
import MyPayClient from './MyPayClient'

const MyPayPage = () => {
    return (
        <>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[300px]">
                    <p className="text-xl text-gray-500">กำลังตรวจสอบข้อมูลผู้ใช้...</p>
                </div>
            } >
                <MyPayClient  />
            </Suspense>
        </>

    )
}

export default MyPayPage