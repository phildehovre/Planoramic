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

    const { handleSubmit, formState: { errors }, register } = useForm()
    const queryClient = useQueryClient()
    const session = useSession()

    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys, 'completed']
    const keys = ressourceType === 'templates' ? templateKeys : campaignKeys;
    const typeOfEvent = ressourceType === 'templates' ? 'template_events' : 'campaign_events'
    const ressourceId = ressource?.data?.data[0][typeOfEvent.split('_')[0] + '_id']

    const addRessource = useMutation({
        mutationFn: async (event: any) => await supabase
            .from(typeOfEvent)
            .insert(event)
            .select(),
    });

    const { selectedTemplateId } = useContext(selectedTemplateContext)


    const onSubmit = (formData: any) => {
        const data = formatRessourceObjectForSubmission(keys, formData)
        let event = {
            ...data,
            author_id: session?.user.id,
            created_at: dayjs().format(),
            position_units: formData.position_units,
            [typeOfEvent.split('_')[0] + '_id']: ressourceId,
        };

        if (typeOfEvent === 'campaign_events') {
            event = {
                ...data,
                completed: false,
                template_id: selectedTemplateId
            }
        }
        addRessource.mutateAsync(event).then((res) => {
            queryClient.invalidateQueries([ressourceType, ressourceId])
            console.log(typeOfEvent, ressourceId)
        }).catch(err => alert(err))
    };


    const renderFormInputs = () => {
        return keys.map((key: string) => {
            return (
                <input
                    type='text'
                    {...register(key)}
                    key={key}
                    className={`cell-ctn ${key}`} placeholder={key}
                />
            )
        })
    }

    return (
        <form className='row-ctn new-row' onSubmit={handleSubmit(onSubmit)}>
            {renderFormInputs()}
            <button type='submit'>Submit</button>
        </form>
    )
}

export default NewRow
