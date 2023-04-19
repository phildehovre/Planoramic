import React, { useEffect, useState } from 'react'
import { CampaignObj } from '../types/types'
import { useParams } from 'react-router'

export const modalContext = React.createContext<ModalType>(undefined as any)

export type ModalType = {
    showModal: boolean,
    setShowModal: (showModal: boolean) => void,
    content: string,
    setContent: (content: string) => void
}


function ModalContextProvider(props: { children: React.ReactNode }) {

    const [showModal, setShowModal] = useState<boolean>(false)
    const [content, setContent] = useState<any>(undefined)

    return (
        <modalContext.Provider
            value={{ showModal, setShowModal, content, setContent }}
        >
            {props.children}
        </modalContext.Provider>
    )
}

export default ModalContextProvider