import React from 'react'
import DashSidebar from '../components/DashSidebar'
import { Outlet } from 'react-router-dom'


const Dashboard = () => {
  return (
   <div className='flex flex-col min-h-screen'>
      
      <div className='flex h-full max-sm:flex-col bg-white'>
        <DashSidebar />
        <div className='md:flex-1 h-full md:pb-3 p-6'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard