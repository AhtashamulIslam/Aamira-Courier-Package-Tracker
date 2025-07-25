import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { signOutSuccess } from '../redux/user/userSlice'

const DashSidebar = () => {

    const {currentUser} = useSelector((state)=>state.user)
    const dispatch = useDispatch();
    const sideBarLinksAdmin = [
     { name: 'Orders', path: '/dashboard' },
     { name: 'Add Order', path: '/dashboard/add-order'},
     { name: 'Tracking Status', path: '/dashboard/tracking-status'},
     { name: 'Sign Out', path: '/'}
  ]

  const handleSignOut=async ()=>{
      try {
        const res =await fetch(`/api/user/signout`,{
          method:'POST'
        })
        const data = await res.json()
        if(!res.ok){
          console.log(data.message)
        }else{
          dispatch(signOutSuccess())
        }
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className='w-55 max-sm:w-full text-base sm:min-h-[100vh] flex flex-col transition-all duration-300
                       bg-gray-200'>
     
      {currentUser && currentUser.isAdmin && sideBarLinksAdmin.map((item, index) => (
        <NavLink to={item.path} key={index} end='/dashboard'
         onClick={item.name === 'Sign Out' && handleSignOut}
        className={({ isActive }) =>
         `flex items-center justify-start gap-2 font-semibold py-3 px-4 mt-1.5 md:px-8 
         ${isActive ? 'border-r-4 md:border-r-[6px] bg-slate-600/10 border-slate-600 text-black' :
          'hover:bg-gray-100/90 text-gray-700 border-white'}
         `}>
          <p className='text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default DashSidebar