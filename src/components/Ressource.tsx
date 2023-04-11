import React, { useEffect } from 'react'
import { useCampaignEvents, useTemplateEvents } from '../util/db'
import { useParams } from 'react-router'
import { useSession } from '@supabase/auth-helpers-react'
import Table from './Table'

function Ressource() {

    const { ressource: ressourceType, id: ressourceId } = useParams()
    const session = useSession()

    const [templateId, setTemplateId] = React.useState<string | undefined>(undefined)
    const [campaignId, setCampaignId] = React.useState<string | undefined>(undefined)

    useEffect(() => {
        if (ressourceType === 'templates') {
            setTemplateId(ressourceId)
        }
        if (ressourceType === 'campaigns') {
            setCampaignId(ressourceId)
        }
    }, [ressourceType, ressourceId, session])

    const templateEvents = useTemplateEvents(templateId)
    const campaignEvents = useCampaignEvents(campaignId)

    return (
        <div>
            <Table
                ressource={ressourceType === 'templates' ? templateEvents : campaignEvents}
                ressourceType={ressourceType}
            />
        </div>
    )
}

export default Ressource