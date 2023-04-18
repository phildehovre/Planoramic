import React, { useEffect } from 'react'
import { useCampaignEvents, useTemplateEvents } from '../util/db'
import { useParams } from 'react-router'
import { useSession } from '@supabase/auth-helpers-react'
import Table from './Table'
import { v4 as uuidv4 } from 'uuid'
import Spinner from './Spinner'

function Ressource() {

    const { ressource: ressourceType, id: ressourceId } = useParams()
    const session = useSession()
    const params = useParams()

    const newTemplateId = 'a1a5a75d-9d1e-4f5b-b23e-4d6918dcc434'
    const newCampaignId = 'b1a5a75d-9d1e-4f5b-b23e-4d6918dcc434'

    const [templateId, setTemplateId] = React.useState<string | undefined>(undefined)
    const [campaignId, setCampaignId] = React.useState<string | undefined>(undefined)

    useEffect(() => {
        if (ressourceType === 'template' && params.id) {
            setTemplateId(ressourceId)
        }
        if (ressourceType === 'template' && !params.id) {
            setTemplateId(newTemplateId)
        }
        if (ressourceType === 'campaign') {
            setCampaignId(ressourceId)
        }
        if (ressourceType === 'campaign' && !params.id) {
            setCampaignId(newCampaignId)
        }
    }, [ressourceType, ressourceId, session])

    const templateEvents = useTemplateEvents(templateId)
    const campaignEvents = useCampaignEvents(campaignId)


    return (
        <div>
            <Table
                ressource={ressourceType === 'template' ? templateEvents : campaignEvents}
                ressourceType={ressourceType}
            />
        </div>
    )
}

export default Ressource