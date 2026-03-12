import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

import AppLayout from './AppLayout'
import ErrorPage from './ErrorPage'
import { listBananas } from './api/bananas'

const Home = lazy(() => import('./Home'))
const Analytics = lazy(() => import('./Analytics'))
const Buy = lazy(() => import('./Buy'))
const Sell = lazy(() => import('./Sell'))
const GroupList = lazy(() => import('./GroupList'))
const FullList = lazy(() => import('./FullList'))

const bananasLoader = async () => listBananas()

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'analytics',
        loader: bananasLoader,
        element: <Analytics />,
      },
      {
        path: 'buy',
        element: <Buy />,
      },
      {
        path: 'sell',
        loader: bananasLoader,
        element: <Sell />,
      },
      {
        path: 'groups',
        loader: bananasLoader,
        element: <GroupList />,
      },
      {
        path: 'list',
        loader: bananasLoader,
        element: <FullList />,
      },
    ],
  },
])
