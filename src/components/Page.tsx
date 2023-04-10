import React from 'react'
import './Page.scss'

function Page(props: { children: React.ReactNode }) {
    return (
        <div className='page'>{props.children}</div>
    )
}

export default Page