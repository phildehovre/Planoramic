import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import './Modals.scss'

function TemplateDescriptionEdit(props: {
    phaseName: string | undefined,
    phaseNumber: number | undefined,
    placeholder?: string | undefined
    setPhaseName: any
    setPhaseNumber: any
    ressource: any
}) {

    const {
        phaseName,
        phaseNumber,
        setPhaseName,
        setPhaseNumber
    } = props

    return (
        <div className='template_description_edit-ctn'>
            <input autoFocus placeholder='Name of the phase' onChange={(e) => { setPhaseName(e.target.value) }} value={phaseName} />
            <input autoFocus type='number' min='1' onChange={(e) => { setPhaseNumber(Number(e.target.value)) }} value={phaseNumber} />
        </div >
    )
}

export default TemplateDescriptionEdit