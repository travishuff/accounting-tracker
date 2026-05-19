import { Suspense } from 'react'
import { Outlet } from 'react-router'

import NavBar from './NavBar'

const AppLayout = () => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <NavBar />
      <div id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
        <Suspense fallback={<div className="page-loading">Loading…</div>}>
          <Outlet />
        </Suspense>
      </div>
    </>
  )
}

export default AppLayout
