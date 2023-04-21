import React, { useEffect } from 'react'
import Row from './Row'
import './Table.scss'
import TableHeader from './TableHeader';
import { useForm } from 'react-hook-form';
import { supabase } from '../App';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NewRow from './NewRow';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useParams } from 'react-router-dom'

const schema = yup.object().shape({
    position: yup.number().min(1).required('A duration is required'),
    position_units: yup.string().required('Select days, weeks, or month(s)'),
    category: yup.string().required('Please chose a category'),
    description: yup.string().required('A description is required'),
    entity_responsible: yup.string().required('Select a responsible entity'),
    type: yup.string().required('Select a type of task'),
})

function Table(props: { ressource: any, ressourceType: string | undefined }) {
    const { ressource, ressourceType } = props;
    const queryClient = useQueryClient()

    const [eventId, setEventId] = React.useState(null)
    const [selectedRows, setSelectedRows] = React.useState([])

    const { register,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) })

    const params = useParams()

    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys, 'completed']
    const keys = ressourceType === 'template' ? templateKeys : campaignKeys

    const updateCellFn = async ({ id, key, val }: any) => {
        return await supabase
            .from(`${ressourceType}_events`)
            .update({ [key]: val })
            .eq('id', id)
            .select()
    }

    const updateCell = useMutation({
        mutationFn: ({ id, key, val }: any) => updateCellFn({ id, key, val })
    });

    const onSubmit = (formData: any) => {
        let keys = Object.keys(formData)
        let key = keys[0]
        let value = formData[key]
        updateCell.mutateAsync({ id: eventId, key: key, val: value }).then((res: any) => {
            queryClient.invalidateQueries({ queryKey: [`${ressourceType}_events`] })
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
            {ressource?.data?.data.length > 0 &&
                <TableHeader
                    setSelectedRows={setSelectedRows}
                    selectedRows={selectedRows}
                    ressource={ressource}
                    ressourceType={ressourceType}
                    events={ressource?.data?.data}
                />
            }
            {ressource?.data?.data.length === 0
                ? <h3>No events yet.</h3>
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

