import React from 'react'
import RessourceLayout from '../layouts/RessourceLayout'
import { Outlet, useParams } from 'react-router'
import RessourceHeader from '../components/RessourceHeader'
import { useSession } from '@supabase/auth-helpers-react'
import { useCampaign, useCampaigns, useTemplate, useTemplates } from '../util/db'


function RessourcePage(props: any) {


    const session = useSession()
    const { id } = useParams()
    const { ressource: ressourceType } = useParams()



    const {
        data: templateData,
        isLoading: isTemplateLoading,
        error: templateError
    } = useTemplate(id, ressourceType === 'templates' && id ? true : false)

    const {
        data: campaignData,
        isLoading: isCampaignLoading,
        error: campaignError
    } = useCampaign(id, ressourceType === 'campaigns' && id ? true : false)

    const headerProps = {
        ressource: ressourceType === 'templates' ? templateData : campaignData,
        ressourceType: ressourceType
    }

    return (
        <RessourceLayout
            header={<RessourceHeader {...headerProps} />}
            outlet={<Outlet />}
        />
    )
}

export default RessourcePage