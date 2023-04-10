import React from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Sidebar from './Sidebar'
import { useCampaigns, useTemplates } from '../util/db'

function Dashboard() {

    const { ressource: ressourceType } = useParams()

    const {
        data: templatesData,
        isLoading: isTemplatesLoading,
        error: templatesError
    } = useTemplates()

    const {
        data: campaignsData,
        isLoading: isCampaignsLoading,
        error: campaignsError
    } = useCampaigns()

    return (
        <DashboardLayout
            sidebar={<Sidebar
                ressource={ressourceType === 'templates' ? templatesData : campaignsData}
            />}
            outlet={< Outlet />} />
    )
}

export default Dashboard