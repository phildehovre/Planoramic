import React from 'react'
import './NewResLayout.scss'

function NewResLayout(props: { content: React.ReactNode }) {

    const { content: Content } = props

    return (
        <div className='newres-layout'>
            <div className='newres-content'>{Content}</div>
        </div>
    )
}

export default NewResLayout