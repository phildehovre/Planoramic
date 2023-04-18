import React from 'react'
import { Outlet } from 'react-router'
import Create from './Create'

function New() {
    return (
        <>
            <Create ressourceType='template' />
            <Create ressourceType='campaign' />
        </>
    )
}

export default New