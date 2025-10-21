import React, { useEffect } from 'react'
import { redirect, RedirectType } from 'next/navigation'


const pageMember = () => {
  redirect('/member/users', RedirectType.replace)

  return (
    <>pageMember</>
  )
}

export default pageMember

