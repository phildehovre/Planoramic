import React, { useState } from 'react'
import { TemplateObj } from '../types/types'

export const selectedTemplateContext = React.createContext<SelectedTemplateInterface>(undefined as any)


interface SelectedTemplateInterface {
    selectedTemplateId: string | undefined | any
    setSelectedTemplateId: any
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