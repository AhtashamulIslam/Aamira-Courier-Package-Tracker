import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'

function OnlyAdminPrivateRoute() {
    const {currentUser}=useSelector(state=>state.user)
    return (currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to='/sign-in' />)
    //Outlet allow the authenticated Admin to the Dashboard.
}

export default OnlyAdminPrivateRoute