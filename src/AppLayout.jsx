import { Suspense } from 'react'
import { Outlet } from 'react-router'

import NavBar from './NavBar'

const AppLayout = () => {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div className="page-loading">Loading…</div>}>
        <Outlet />
      </Suspense>
    </>
  )
}

export default AppLayout
