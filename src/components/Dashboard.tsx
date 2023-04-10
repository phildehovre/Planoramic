import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Sidebar from './Sidebar'

function Dashboard() {


    return (
        <DashboardLayout sidebar={<Sidebar />} outlet={< Outlet />} />
    )
}

export default Dashboard