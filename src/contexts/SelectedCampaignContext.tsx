import React, { useEffect, useState } from 'react'
import { CampaignObj } from '../types/types'
import { useParams } from 'react-router'

export const selectedCampaignContext = React.createContext<SelectedCampaignType>(undefined as any)

export type SelectedCampaignType = {
    selectedCampaignId: string | undefined
    setSelectedCampaignId: any
}


function SelectedCampaignContextProvider(props: { children: React.ReactNode }) {

    const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(undefined)

    return (
        <selectedCampaignContext.Provider
            value={{ selectedCampaignId, setSelectedCampaignId }}
        >
            {props.children}
        </selectedCampaignContext.Provider>
    )
}

export default SelectedCampaignContextProvider