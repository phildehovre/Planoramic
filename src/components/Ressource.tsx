import React from 'react'
import RessourceLayout from '../layouts/RessourceLayout'
import { Outlet } from 'react-router'
import RessourceHeader from './RessourceHeader'
import { useSession } from '@supabase/auth-helpers-react'


function Ressource() {

    const session = useSession()

    console.log(session)

    return (
        <RessourceLayout header={<RessourceHeader />} outlet={<Outlet />} />
    )
}

export default Ressource