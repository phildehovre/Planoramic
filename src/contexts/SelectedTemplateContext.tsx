import React, { useState } from 'react'
import { TemplateObj } from '../types/types'

export const selectedTemplateContext = React.createContext<SelectedTemplateInterface | undefined>(undefined)


interface SelectedTemplateInterface {
    selectedTemplateId?: string | undefined
    setSelectedTemplateId: React.Dispatch<React.SetStateAction<string | undefined>>
}

function SelectedTemplateContextProvider(props: { children: React.ReactNode }) {

    const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined)

    const values = { selectedTemplateId, setSelectedTemplateId }

    return (
        <selectedTemplateContext.Provider
            value={values}
        >
            {props.children}
        </selectedTemplateContext.Provider>
    )
}

export default SelectedTemplateContextProvider