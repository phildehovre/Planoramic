import React, { useEffect } from 'react'
import './Modals.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object().shape({
    position: yup.number().min(1).required('A duration is required'),
    position_units: yup.string().required('Select days, weeks, or month(s)'),
    category: yup.string().required('Please chose a category'),
    description: yup.string().required('A description is required'),
    entity_responsible: yup.string().required('Select a responsible entity'),
    type: yup.string().required('Select a type of task'),
})

function NewCampaignFromTemplate(props: {
    placeholder?: string | undefined
    ressource?: any
    ressourceType?: string | undefined
    onSubmit: any
}) {

    const {
        ressource,
        ressourceType,
        onSubmit,
    } = props;

    const { handleSubmit, register } = useForm();

    async function handleFormSubmit(data: any) {
        console.log('through cell: ', data)
        await handleSubmit((formData: any) => onSubmit(formData))(data)
        // This code will execute after the handleSubmit Promise is resolved
    }

    return (
        <form
            className='modal_form-ctn'
            onSubmit={handleFormSubmit}>
            <input
                type='text'
                {...register('artistName')}
                name='artistName'
                placeholder='Artist name...'
                autoComplete='off'
            />
            <input
                type='text'
                {...register('songName')}
                name='songName'
                placeholder='Song title...'
                autoComplete='off'
            />
            <input
                type='date'
                {...register('targetDate')}
                name='targetDate'
            />
            <button type='submit'>Create</button>
        </form>
    )
}

export default NewCampaignFromTemplate