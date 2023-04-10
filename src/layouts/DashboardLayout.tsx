import React from 'react'

function DashboardLayout(props: { sidebar: React.ReactNode, outlet: React.ReactNode }) {

    const { sidebar: Sidebar, outlet: Outlet } = props

    return (
        <div className='dahboard-layout'>
            <div className='sidebar'>{Sidebar}</div>
            <div className='outlet'>{Outlet}</div>
        </div>
    )
}

export default DashboardLayout