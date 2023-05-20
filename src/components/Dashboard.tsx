import React, { useEffect } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Sidebar from './Sidebar'
import { useCampaigns, useTemplates } from '../util/db'
import Navbar from './Navbar'

function Dashboard() {
    const [ressources, setRessources] = React.useState<any[]>([])
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

    useEffect(() => {
        if (campaignsData?.data && templatesData?.data) {
            setRessources([
                {
                    type: 'templates',
                    data: [...templatesData.data].sort((a, b) => a.name.localeCompare(b.name))
                },
                {
                    type: 'campaigns',
                    data: [...campaignsData.data].sort((a, b) => a.name.localeCompare(b.name))
                }
            ])
        }
    }, [campaignsData, templatesData])


    return (
        <DashboardLayout
            navbar={<Navbar />}
            sidebar={<Sidebar
                ressources={ressources}
                ressourceType={ressourceType}
            />}
            outlet={< Outlet />} />
    )
}

export default Dashboard