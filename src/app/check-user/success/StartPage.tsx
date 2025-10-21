'use client'
import { CallIcon } from '@/assets/icons'
import InputGroup from '@/components/FormElements/InputGroup'
import { Button } from '@/components/ui-elements/button'
import Card from '@/components/ui/Card'
import { api, handleAxiosError } from '@/utils/api'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { PiMagnifyingGlass } from 'react-icons/pi'
import { toast } from 'react-toastify'
import PayPage from './PayPage'

interface propType {
    currentUserId: string | null
    checkStatus: boolean
}

const StartPage = ({ currentUserId, checkStatus }: propType) => {
    const [tel, setTel] = useState("")
    const router = useRouter()


    const handleSaveRegister = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!tel && !currentUserId) {
            toast.error('กรุณากรอกเบอโทรศัพท์ !')
            return
        }
        try {
            const res = await api.post(`${process.env.NEXT_PUBLIC_API}/members/${process.env.NEXT_PUBLIC_V}/link`, {
                tel: tel,
                user_id: currentUserId
            })
            console.log(res);
            if (res.status === 200) {
                toast.success('สมัครสมาชิกสำเร็จ')
                //  window.location.reload()
                router.push('/check-user')

            }
        } catch (error) {
            const result = await handleAxiosError(error)
            toast.error(result)
        }

    }
    return (
        <div>
            StartPage {currentUserId} <br />
            checkStatus : {JSON.stringify(checkStatus)}

            <div className='w-full h-screen flex justify-center items-center'>
                <Card className='w-1/3'>
                    <h3 className='text-base text-center text-dark-4'>ระบบชำระเงิน มิตรแท้ไอโฟน</h3>

                    <div className='mt-2'>
                        {!checkStatus ? (
                            <div className=''>
                                <h2 className='text-xl text-center text-dark-2'>สมัครสมาชิก</h2>
                                <form onSubmit={handleSaveRegister} >
                                    <div className='mt-5 px-4'>
                                        <InputGroup
                                            label="เบอร์โทรศัพท์"
                                            placeholder="กรอกเบอร์โทรศัพท์"
                                            type="text"
                                            className=''
                                            icon={<CallIcon />}
                                            iconPosition="left"
                                            value={tel}
                                            onChange={(e) => setTel(e.target.value)}
                                            maxLength={10}
                                        />
                                        <Button type="submit" label='สมัครสมาชิก' className='mt-4 w-full rounded-md h-10' />
                                    </div>

                                </form>
                            </div>
                        ) : (
                            <div>
                                <PayPage/>
                            </div>
                        )}

                    </div>


                </Card>
            </div>

        </div>
    )
}

export default StartPage