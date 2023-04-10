import React from 'react'
import RessourceLayout from '../layouts/RessourceLayout'
import { Outlet } from 'react-router'
import RessourceHeader from './RessourceHeader'


function Ressource() {
    return (
        <RessourceLayout header={<RessourceHeader />} outlet={<Outlet />} />
    )
}

export default Ressource