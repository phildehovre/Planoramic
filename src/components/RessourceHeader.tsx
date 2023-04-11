import React from 'react'
import './RessourceHeader.scss'
import TestForm from './TestForm'
import { Spinner } from 'react-bootstrap'

function RessourceHeader(props: any) {
    const { ressource } = props

    const renderHeader = () => {
        return (
            <div className="ressource-header">
                <h2>{ressource.data.name}</h2>
                <p>{ressource.data.description}</p>

            </div>
        )
    };

    return (
        <>
            {
                !ressource || ressource.isLoading
                    ? <Spinner />
                    : renderHeader()

            }


        </>
    )
}

export default RessourceHeader