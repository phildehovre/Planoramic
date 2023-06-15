import React, { useEffect } from 'react'
import { useCampaignEvents, useTemplateEvents } from '../util/db'
import { useParams } from 'react-router'
import { useSession } from '@supabase/auth-helpers-react'
import Table from './Table'
import { convertPositionToDate } from '../utils/helpers'

function Ressource() {

    const { ressource: ressourceType, id: ressourceId } = useParams()
    const session = useSession()
    const params = useParams()

    const newTemplateId = 'a1a5a75d-9d1e-4f5b-b23e-4d6918dcc434'
    const newCampaignId = 'b1a5a75d-9d1e-4f5b-b23e-4d6918dcc434'

    const [templateId, setTemplateId] = React.useState<string | undefined>(undefined)
    const [campaignId, setCampaignId] = React.useState<string | undefined>(undefined)
    const [formattedCampaignEvents, setFormattedCampaignEvents] = React.useState<any>({ data: { data: [] } })

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

    useEffect(() => {
        if (campaignEvents?.data?.data) {
            const sortedEvents = campaignEvents?.data?.data.sort((a: any, b: any) => b.position - a.position)
            // const formattedEvents = sortedEvents.map((event: any) => { 
            //     console.log(event)
            //     return {...event, position: convertPositionToDate(event.position, event.position_units, event.start_date)} 
            // })
            setFormattedCampaignEvents((prev: any) => {
                return { ...prev, data: { data: [...sortedEvents] } }
            })
        }

    }, [campaignEvents?.data?.data])

    return (
        <div>
            <Table
                ressource={ressourceType === 'template' ? templateEvents : formattedCampaignEvents}
                ressourceType={ressourceType}
            />
        </div>
    )
}

export default Ressource