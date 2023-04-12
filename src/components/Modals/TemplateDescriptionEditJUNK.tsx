import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import './Modals.scss'

function TemplateDescriptionEdit(props: {
    setDescription: (description: string) => void
    ressource: any
    placeholder?: string | undefined
}) {
    const { ressource, setDescription, placeholder } = props
    const { description } = ressource.data


    return (
        <div className='template_description_edit-ctn'>
            <input autoComplete='off' autoFocus placeholder={'Describe the purpose of this template'} onChange={(e) => { setDescription(e.target.value) }} value={description} />
        </div >
    )
}

export default TemplateDescriptionEdit