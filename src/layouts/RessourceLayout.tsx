import React from 'react'
import './RessourceLayout.scss'

function RessourceLayout(props: { header: React.ReactNode, outlet: React.ReactNode }) {
    const { header: Header, outlet: Outlet } = props

    // console.log(Header?.props?.ressource?.data)


    return (

        <div className='ressource-layout'>
            <div className='header-layout'>{Header}</div>
            <div className='ressource-outlet'>{Outlet}</div>
        </div>
    )
}

export default RessourceLayout