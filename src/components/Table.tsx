import React, { useEffect } from 'react'
import Row from './Row'
import './Table.scss'
import Spinner from './Spinner';
import TableHeader from './TableHeader';
import { useForm } from 'react-hook-form';
import { supabase } from '../App';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NewRow from './NewRow';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

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
    const [selectedRows, setSelectedRows] = React.useState([])
    const [typeOfEvent, setTypeOfEvent] = React.useState('')
    const [ressourceId, setRessourceId] = React.useState<string | undefined>(undefined)

    const { register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
    } = useForm({ resolver: yupResolver(schema) })

    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys, 'completed']
    const keys = ressourceType === 'template' ? templateKeys : campaignKeys

    useEffect(() => {
        if (ressource?.data?.data?.length > 0) {
            setTypeOfEvent(ressourceType === 'template' ? 'template_events' : 'campaign_events')
            setRessourceId(ressource?.data?.data[0][ressourceType + '_id'])
        }
    }, [])

    const updateCellFn = async ({ id, key, val }: any) => {
        return await supabase
            .from(typeOfEvent)
            .update({ [key]: val })
            .eq('id', id)
            .select()
    }

    const updateCell = useMutation({
        mutationFn: ({ id, key, val }: any) => updateCellFn({ id, key, val })
    });

    const onSubmit = (formData: any, callback: any) => {
        console.log(formData)
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
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
            />
        });
    }
    return (
        <div className='table-ctn'>
            {!ressource.isLoading && ressource?.data?.data.length > 0 &&
                <TableHeader
                    setSelectedRows={setSelectedRows}
                    selectedRows={selectedRows}
                    ressource={ressource}
                    ressourceType={ressourceType}
                    events={ressource?.data?.data}
                />
            }
            {ressource?.data?.data.length === 0
                ? <Spinner />
                : renderRows()
            }
            <NewRow
                keys={keys}
                onSubmit={onSubmit}
                ressource={ressource}
                ressourceType={ressourceType}
                register={register}
            />
        </div>
    )
}

export default Table

