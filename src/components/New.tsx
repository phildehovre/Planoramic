import React from 'react'
import { Outlet } from 'react-router'
import Create from './Create'
import NewResLayout from '../layouts/NewResLayout'

function New() {
    return (
        <NewResLayout
            content={
                <>
                    <Create ressourceType='template' />
                    <Create ressourceType='campaign' />
                    <Create ressourceType='task' />
                </>
            } />
    )
}

export default New