import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AppLayout } from './components/AppLayout'
import { TodayPage } from './pages/TodayPage'
import { PlanningPage } from './pages/PlanningPage'
import { TasksPage } from './pages/TasksPage'
import { FocusPage } from './pages/FocusPage'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: 'planning', element: <PlanningPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'focus', element: <FocusPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
