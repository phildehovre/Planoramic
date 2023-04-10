import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

export const selectedDataTableContext = React.createContext<SelectedDataTableType | undefined>(undefined)

export type SelectedDataTableType = {
    dataTableId: string | undefined
    dataTableType: string | undefined
    setSelectedDataTableId: React.Dispatch<React.SetStateAction<string | undefined>>
    setDataTableType: React.Dispatch<React.SetStateAction<string | undefined>>
}


function SelectedDataTableContextProvider(props: { children: React.ReactNode }) {

    const params = useParams()

    useEffect(() => {
        setDataTableType(params.type)
        setSelectedDataTableId(params.id)
    })

    const [dataTableId, setSelectedDataTableId] = useState<string | undefined>(undefined)
    const [dataTableType, setDataTableType] = React.useState<string | undefined>()


    return (
        <selectedDataTableContext.Provider
            value={{
                dataTableId,
                setSelectedDataTableId,
                setDataTableType,
                dataTableType,

            }}
        >
            {props.children}
        </selectedDataTableContext.Provider>
    )
}

export default SelectedDataTableContextProvider