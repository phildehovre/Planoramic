import React from 'react'
import './DashboardLayout.scss'

function DashboardLayout(props: {
    sidebar: React.ReactNode,
    outlet: React.ReactNode
}) {

    const {
        sidebar: Sidebar,
        outlet: Outlet,
    } = props

    return (
        <div className='dashboard-layout'>
            <div className='sidebar-layout'>{Sidebar}</div>
            <div className='dashboard-outlet'>{Outlet}</div>
        </div>
    )
}

export default DashboardLayout