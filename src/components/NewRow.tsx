import React, { useContext, useEffect } from 'react'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { supabase } from '../App'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@supabase/auth-helpers-react'
import { formatRessourceObjectForSubmission } from '../utils/ressourceObjectFormatter'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import { useParams } from 'react-router'

const schema = yup.object().shape({
    description: yup.string().required('A description is required'),
    // position: yup.number().min(1).required('A duration is required'),
    // position_units: yup.string().required('A duration is required'),
    // category: yup.string().required('Please chose a category'),
    // entity_responsible: yup.string().required('Select a responsible entity'),
    // type: yup.string().required('Select a type of task'),
})

function NewRow(props: {
    ressource: any
    ressourceType: string | undefined
    keys: string[]
    onSubmit: any
    register: any
    phaseNumber: number | undefined
    phaseName: string | undefined
}) {

    const { selectedTemplateId, setSelectedTemplateId } = useContext(selectedTemplateContext)
    const { selectedCampaignId, setSelectedCampaignId } = useContext(selectedCampaignContext)

    useEffect(() => {
        if (ressourceType === 'template' && selectedTemplateId === undefined) {
            setSelectedTemplateId(params.id)
        }
        if (ressourceType === 'campaign' && selectedCampaignId === undefined) {
            setSelectedCampaignId(params.id)
        }
    }, [selectedTemplateId, selectedCampaignId])

    const {
        ressource,
        ressourceType,
        phaseName, phaseNumber
    } = props

    const {
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        reset
    } = useForm({ resolver: yupResolver(schema) })
    const queryClient = useQueryClient()
    const session = useSession()
    const params = useParams()

    const templateKeys = ['description']
    const campaignKeys = [...templateKeys]
    const keys = ressourceType === 'template' ? templateKeys : campaignKeys;
    const typeOfEvent = ressourceType === 'template' ? 'template_events' : 'campaign_events'

    const addRessource = useMutation({
        mutationFn: async (event: any) => await supabase
            .from(typeOfEvent)
            .insert(event)
            .select(),
    });


    const onSubmit = (formData: any) => {
        const data = formatRessourceObjectForSubmission(keys, formData)
        let event = {
            ...data,
            author_id: session?.user.id,
            created_at: dayjs().format(),
            position_units: formData.position_units,
            phase_number: phaseNumber,
            phase_name: phaseName,
            template_id: selectedTemplateId || params.id,
        };

        if (typeOfEvent === 'campaign_events') {
            event = {
                ...event,
                completed: false,
                template_id: ressource?.data?.data[0].template_id,
                campaign_id: selectedCampaignId || params.id
            }
        }
        addRessource.mutateAsync(event).then(() => {
            queryClient.invalidateQueries([typeOfEvent])
            reset()
        });
    }

    const renderFormInputs = () => {
        return keys.map((key: string) => {
            if (key !== 'entity_responsible' && key !== 'type') {
                return (
                    <input
                        type='text'
                        {...register(key)}
                        key={key}
                        className={`cell-ctn ${key}`}
                        placeholder={key}
                        autoComplete='off'
                        autoFocus={true}
                    />
                )

            }
        })
    }

    return (

        <form className='row-ctn new-row' onSubmit={handleSubmit(onSubmit)}>
            <div className='row-inputs'>
                {renderFormInputs()}
                <button type='submit' className='row-inputs btn'>
                    {/* <FontAwesomeIcon icon={faPlus} size='2x' /> */}
                    Add
                </button>
            </div>
        </form>
    )
}

export default NewRow