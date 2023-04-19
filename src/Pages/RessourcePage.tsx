import React from 'react'
import RessourceLayout from '../layouts/RessourceLayout'
import { Outlet, useParams } from 'react-router'
import RessourceHeader from '../components/RessourceHeader'
import { useSession } from '@supabase/auth-helpers-react'
import { useCampaign, useCampaigns, useTemplate, useTemplates } from '../util/db'


function RessourcePage(props: any) {


    const session = useSession()
    const { ressource: ressourceType, id } = useParams()


    const {
        data: templateData,
        isLoading: isTemplateLoading,
        error: templateError
    } = useTemplate(id, ressourceType === 'template' && id ? true : false)

    const {
        data: campaignData,
        isLoading: isCampaignLoading,
        error: campaignError
    } = useCampaign(id, ressourceType === 'campaign' && id ? true : false)

    const headerProps = {
        ressource: ressourceType === 'template' ? templateData : campaignData,
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