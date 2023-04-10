import React, { ReactNode } from 'react'
import Page from '../components/Page'
import './HomepageLayout.scss'

function HomepageLayout(props: { navbar: React.ReactNode, body: React.ReactNode }) {

    const { navbar, body } = props


    return (
        <div className='homepage-layout'>
            <div className='navbar'>{navbar}</div>
            <div className='body'>{body}</div>
        </div >
    )
}

export default HomepageLayout