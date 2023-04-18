import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import './Modals.scss'

function NewRessource(props: {
    name: string | undefined,
    setName: (description: string) => void
    placeholder?: string | undefined
    ressource?: any
}) {

    const { setName, name } = props


    return (
        <div className='template_name_edit-ctn'>
            <label>Template name:</label>
            <input autoFocus placeholder={name} onChange={(e) => { setName(e.target.value) }} value={name} />
        </div >
    )
}

export default NewRessource