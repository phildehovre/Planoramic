import React from 'react'
import Row from './Row'
import './Table.scss'
import Spinner from './Spinner';
import TableHeader from './TableHeader';
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { supabase } from '../App';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const schema = yup.object().shape({
    position: yup.number().min(1).required('A duration is required'),
    position_units: yup.string().required('A duration is required'),
    category: yup.string().required('Please chose a category'),
    description: yup.string().required('A description is required'),
    entity_responsible: yup.string().required('Select a responsible entity'),
    type: yup.string().required('Select a type of task'),
})

function Table(props: { ressource: any, ressourceType: string | undefined }) {
    const { ressource, ressourceType } = props;
    const queryClient = useQueryClient()

    const [eventid, setEventId] = React.useState(null)

    const { register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
    } = useForm({ resolver: yupResolver(schema) })


    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys, 'completed']
    const keys = ressourceType === 'templates' ? templateKeys : campaignKeys;
    const typeOfEvent = ressourceType === 'templates' ? 'template_events' : 'campaign_events'
    const ressourceId = ressource?.data?.data[0][typeOfEvent.split('_')[0] + '_id']



    const updateCellFn = async ({ id, key, val }: any) => {
        return await supabase
            .from(typeOfEvent)
            .update({ [key]: val })
            .eq('id', id)
            .select()
    }

    const updateCell = useMutation({
        mutationFn: ({ id, key, val }: any) => updateCellFn({ id, key, val })
            .then(() => {
                queryClient.invalidateQueries({ queryKey: [typeOfEvent, id] })
            }),
    });

    const onSubmit = (formData: any, callback: any) => {
        console.log('submitting', formData)
        let keys = Object.keys(formData)
        let key = keys[0]
        let value = formData[key]
        updateCell.mutateAsync({ id: eventid, key: key, val: value }).then((res: any) => {
            queryClient.invalidateQueries({ queryKey: [typeOfEvent, ressourceId] })
        }
        )
    }

    const renderRows = () => {
        let data = ressource?.data?.data.sort((a: any, b: any) => b.position - a.position)
        return data?.map((row: any) => {
            return <Row
                row={row}
                key={row.id}
                keys={keys}
                onSubmit={onSubmit}
                setEventId={setEventId}
            />
        });
    }
    return (
        <div className='table-ctn'>
            <TableHeader ressource={ressource} ressourceType={ressourceType} />
            {ressource.isLoading
                ? <Spinner />
                : renderRows()
            }
        </div>
    )
}

export default Table