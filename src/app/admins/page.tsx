import React, { useEffect } from 'react'
import { redirect, RedirectType } from 'next/navigation'


const PageAdmin = () => {
  redirect('/admins/reports', RedirectType.replace)

  return (
    <>PageAdmin</>
  )
}

export default PageAdmin