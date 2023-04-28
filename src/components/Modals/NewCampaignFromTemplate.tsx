import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import './Modals.scss'

function NewCampaignFromTemplate(props: {
    name: string | undefined,
    setName: (description: string) => void
    placeholder?: string | undefined
    ressource?: any
}) {

    const { setName, name } = props


    return (
        <div className='template_name_edit-ctn'>
            <label>Select the template: </label>
            {/* <Select autoFocus placeholder={name} onChange={(e) => { setName(e.target.value) }} value={name} /> */}
        </div >
    )
}

export default NewCampaignFromTemplate