import React from 'react'
import './DashboardLayout.scss'

function DashboardLayout(props: {
    navbar: React.ReactNode,
    sidebar: React.ReactNode,
    outlet: React.ReactNode
}) {

    const {
        navbar: Navbar,
        sidebar: Sidebar,
        outlet: Outlet
    } = props

    return (
        <div className='dashboard-layout'>
            <div className='dashboard-navbar'>{Navbar}</div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className='sidebar-layout'>{Sidebar}</div>
                <div className='dashboard-outlet'>{Outlet}</div>
            </div>
        </div>
    )
}

export default DashboardLayout