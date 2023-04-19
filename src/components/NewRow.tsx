import React, { useContext } from 'react'
import Row from './Row'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { supabase } from '../App'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'
import { useSession } from '@supabase/auth-helpers-react'
import { formatRessourceObjectForSubmission } from '../utils/ressourceObjectFormatter'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import { selectedDataTableContext } from '../contexts/SelectedDataTableContext'
import { useParams } from 'react-router'
import Select from './Select'
import { SelectOptions } from '../assets/selectOptions'

const schema = yup.object().shape({
    position: yup.number().min(1).required('A duration is required'),
    position_units: yup.string().required('A duration is required'),
    category: yup.string().required('Please chose a category'),
    description: yup.string().required('A description is required'),
    entity_responsible: yup.string().required('Select a responsible entity'),
    type: yup.string().required('Select a type of task'),
})

function NewRow(props: {
    ressource: any
    ressourceType: string | undefined
    keys: string[]
    onSubmit: any
    register: any
}) {


    const {
        ressource,
        ressourceType,
    } = props
    // const submitKeys = ressource?.data?.data.map(())

    const { handleSubmit, formState: { errors }, register, setValue } = useForm()
    const queryClient = useQueryClient()
    const session = useSession()
    const params = useParams()

    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys]
    const keys = ressourceType === 'template' ? templateKeys : campaignKeys;
    const typeOfEvent = ressourceType === 'template' ? 'template_events' : 'campaign_events'
    // const ressourceId = ressource?.data?.data[0][typeOfEvent.split('_')[0] + '_id']

    const addRessource = useMutation({
        mutationFn: async (event: any) => await supabase
            .from(typeOfEvent)
            .insert(event)
            .select(),
    });

    const { selectedTemplateId } = useContext(selectedTemplateContext)
    const { selectedCampaignId } = useContext(selectedCampaignContext)

    const onSubmit = (formData: any) => {
        const data = formatRessourceObjectForSubmission(keys, formData)
        let event = {
            ...data,
            author_id: session?.user.id,
            created_at: dayjs().format(),
            position_units: formData.position_units,
            template_id: selectedTemplateId,
        };

        if (typeOfEvent === 'campaign_events') {
            event = {
                ...data,
                completed: false,
                template_id: ressource?.data?.data[0].template_id,
                campaign_id: selectedCampaignId || params.id
            }
        }
        addRessource.mutateAsync(event).then(() => {
            queryClient.invalidateQueries([typeOfEvent])
        })
    }

    const renderFormInputs = () => {
        return keys.map((key: string) => {
            return (
                <input
                    type='text'
                    {...register(key)}
                    key={key}
                    className={`cell-ctn ${key}`}
                    placeholder={key}
                    autoComplete='off'
                />
            )
        })
    }


    return (
        <form className='row-ctn new-row' onSubmit={handleSubmit(onSubmit)}>
            <div className='row-inputs'>
                {renderFormInputs()}
            </div>
            <div className='row-inputs btn'>
                <button type='submit'>Submit</button>
            </div>
        </form>
    )
}

export default NewRow
