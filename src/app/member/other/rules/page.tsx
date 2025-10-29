import Card from '@/components/ui/Card'
import React from 'react'

const PageRules = () => {
    return (
        <div>
            <Card>
                <h3 className='text-xl'>เวลาเริ่มปรับ</h3>
                <ul className='flex flex-col md:flex-row gap-3'>
                    <li className=' border border-dark-7 dark:border-dark-4 w-full md:w-1/4 text-center mt-4 rounded-md'>
                        <h4 className='text-lg bg-dark-7 dark:bg-dark-3 py-1'>ผ่อน</h4>
                        <div className='py-4 dark:bg-dark-2'>
                            15 วัน
                        </div>
                    </li>

                    <li className=' border border-dark-7 dark:border-dark-4 w-full md:w-1/4 text-center mt-4 rounded-md'>
                        <h4 className='text-lg bg-dark-7 dark:bg-dark-3 py-1'>เช่า</h4>
                        <div className='py-4 dark:bg-dark-2'>
                            3 วัน
                        </div>
                    </li>
                </ul>
            </Card>

            <Card className='mt-4'>
                <h3 className='text-xl'>เวลาแจ้งบิล Line</h3>
                <ul className='flex flex-col md:flex-row gap-3'>
                    <li className=' border border-dark-7 dark:border-dark-4 w-full md:w-1/4 text-center mt-4 rounded-md'>
                        <h4 className='text-lg bg-dark-7 dark:bg-dark-3 py-1'>ผ่อน-เช่า</h4>
                        <div className='py-4 dark:bg-dark-2'>
                            7:00, 12:00, 16:00
                        </div>
                    </li>
                </ul>
            </Card>

            <Card className='mt-4 '>
                <h3 className='text-xl'>อธิบายแต่ละเมนู</h3>
                <ul className='flex flex-col md:flex-row gap-3 '>
                    <li className=' border border-dark-7 dark:border-dark-4 w-full md:w-1/4 text-center mt-4 rounded-md h-fit'>
                        <h4 className='text-lg bg-dark-7 dark:bg-dark-3 py-1'>ADMIN</h4>
                        <div className='py-4 dark:bg-dark-2 px-4' >
                            <div className='text-start'>
                                <h4 className='text-lg font-bold'>Dashboard</h4>
                                <p className='mt-0.5'>สำหรับดูรายงานยอดขายที่ปิดการขายไปได้แล้วโดยเลือกจากวันที่เริ่มต้น - วันที่สิ้นสุด</p>
                            </div>

                            <div className='text-start mt-4'>
                                <h4 className='text-lg font-bold'>ข้อมูลพื้นฐาน</h4>
                                <p className='mt-0.5'>สำหรับให้แอดมินจัดการข้อมูลพื้นฐานเบสิกที่จำเป็นทั้งหมดของระบบ</p>
                            </div>

                            <div className='text-start mt-4'>
                                <h4 className='text-lg font-bold'>ตั้งค่าระบบ</h4>
                                <p className='mt-0.5'>สามารถตั้งค่า ราคาค่าปรับของทั้งผ่อน และเช่าได้</p>
                            </div>
                        </div>
                    </li>

                    <li className=' border border-dark-7 dark:border-dark-4 w-full md:w-1/4 text-center mt-4 rounded-md h-fit'>
                        <h4 className='text-lg bg-dark-7 dark:bg-dark-3 py-1'>MEMBER</h4>
                        <div className='py-4 dark:bg-dark-2 px-4' >
                            <div className='text-start'>
                                <h4 className='text-lg font-bold'>ข้อมูลลูกค้า</h4>
                                <p className='mt-0.5'>จัดการข้อมูลลูกค้าก่อนที่จะสร้างบิลผ่อน-เช่า</p>
                            </div>

                            <div className='text-start mt-4'>
                                <h4 className='text-lg font-bold'>ข้อมูลประเภทสินค้า</h4>
                                <p className='mt-0.5'>สร้างประเถทสินค้าก่อนเพิ่มสินค้า</p>
                            </div>

                            <div className='text-start mt-4'>
                                <h4 className='text-lg font-bold'>ข้อมูลสินค้า</h4>
                                <p className='mt-0.5'>เพิ่มสินค้าสำหรับใช้เลือกในบิล ผ่อน-เช่า</p>
                            </div>
                        </div>
                    </li>

                    <li className=' border border-dark-7 dark:border-dark-4 w-full md:w-1/4 text-center mt-4 rounded-md h-fit'>
                        <h4 className='text-lg bg-dark-7 dark:bg-dark-3 py-1'>SYSTEM</h4>
                        <div className='py-4 dark:bg-dark-2 px-4' >
                            <div className='text-start'>
                                <h4 className='text-lg font-bold'>ผ่อน</h4>
                                <p className='mt-0.5'>สร้างบิลผ่อน ตามเงื่อนไข</p>
                            </div>

                            <div className='text-start mt-4'>
                                <h4 className='text-lg font-bold'>ไอโฟนแลกเงิน</h4>
                                <p className='mt-0.5'>สร้างรายการเช่า 2 ประเภท ราย 10 วัน และ รายเดือน</p>
                            </div>

                        </div>
                    </li>
                </ul>
            </Card>

        </div>
    )
}

export default PageRules