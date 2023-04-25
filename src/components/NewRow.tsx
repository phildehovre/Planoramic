import React, { useContext } from 'react'
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
import { useParams } from 'react-router'
import { SelectOptions } from '../assets/selectOptions'
import SelectRefactor from './SelectRefactor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

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
    // keys: string[]
    onSubmit: any
    register: any
    propKeys: string[],
    phaseNumber?: number
    phaseName?: string
}) {


    const {
        ressource,
        ressourceType,
        propKeys,
        phaseNumber,
        phaseName
    } = props

    const { handleSubmit, formState: { errors }, register, setValue, reset } = useForm({ resolver: yupResolver(schema) })
    const queryClient = useQueryClient()
    const session = useSession()
    const params = useParams()

    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys]
    const keys = ressourceType === 'template' ? templateKeys : campaignKeys;
    const typeOfEvent = ressourceType === 'template' ? 'template_events' : 'campaign_events'

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
            phase_number: phaseNumber || null,
            phase_name: phaseName || '',
            template_id: selectedTemplateId,
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
        })
    }

    const renderFormInputs = () => {
        return propKeys.map((key: string) => {
            if (key !== 'entity_responsible' && key !== 'type') {
                return (
                    <input
                        type='text'
                        {...register(key)}
                        key={key}
                        className={`cell-ctn ${key}`}
                        placeholder={'New task...'}
                        autoComplete='off'
                        autoFocus={true}
                    />
                )

            }
            // if (key === 'entity_responsible') {
            //     return (
            //         <SelectRefactor
            //             options={SelectOptions.entity_responsible}
            //             register={register}
            //             setValue={setValue}
            //             key={key}
            //             onOptionClick={() => { console.log('option click') }}
            //             label={'entity_responsible'}
            //         />
            //     )
            // }
            // if (key === 'type') {
            //     return (
            //         <SelectRefactor
            //             options={SelectOptions.type}
            //             register={register}
            //             setValue={setValue}
            //             key={key}
            //             label={'type'}
            //             onOptionClick={() => { console.log('option click') }}
            //         />
            //     )
            // }
        })
    }

    return (

        <form className='row-ctn new-row' onSubmit={handleSubmit(onSubmit)}>
            <div className='row-inputs'>
                {renderFormInputs()}
            </div>
            <button type='submit'>
                <FontAwesomeIcon icon={faPlus} size='lg' />
            </button>
        </form>
    )
}

export default NewRow
