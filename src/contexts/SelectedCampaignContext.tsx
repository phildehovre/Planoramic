import React, { useEffect, useState } from 'react'
import { CampaignObj } from '../types/types'
import { useParams } from 'react-router'
import { useCampaign } from '../util/db'

export const selectedCampaignContext = React.createContext<SelectedCampaignType>(undefined as any)

export type SelectedCampaignType = {
    selectedCampaignId: string | undefined
    setSelectedCampaignId: any
    campaignData: any
}


function SelectedCampaignContextProvider(props: { children: React.ReactNode }) {


    const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(undefined)
    const [campaignData, setCampaignData] = useState<any>(undefined)

    const { data, isLoading, error } = useCampaign(selectedCampaignId, !!selectedCampaignId)

    useEffect(() => {
        if (data?.data) {
            setCampaignData(data?.data)
        }
    })

    return (
        <selectedCampaignContext.Provider
            value={{
                selectedCampaignId,
                setSelectedCampaignId,
                campaignData
            }}
        >
            {props.children}
        </selectedCampaignContext.Provider>
    )
}

export default SelectedCampaignContextProvider