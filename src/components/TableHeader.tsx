import React, { useContext } from 'react'
import Row from './Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDeleteEvent } from '../util/db';
import Spinner from './Spinner';
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext';

function TableHeader(props: {
    ressource: any,
    ressourceType: string | undefined
    selectedRows: any,
    setSelectedRows: any,
    events: any
}) {
    const {
        ressource,
        ressourceType,
        selectedRows,
        setSelectedRows,
        events
    } = props;


    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys, 'completed']

    const templateObject = {
        description: 'Description',
        position: 'Position',
        category: 'Category',
        entity_responsible: 'Entity Responsible',
        type: 'Type'
    }
    const keys = ressourceType === 'template' ? templateKeys : campaignKeys;

    const handleSelectAll = () => {
        if (selectedRows.length !== events.length) {
            setSelectedRows(events?.map((event: any) => {
                return ressourceType === 'template' ? event.id : event.event_id
            }))
        } else {
            setSelectedRows([])
        }
    }

    const { deleteEvent, deleteEventMutation } = useDeleteEvent()
    const queryClient = useQueryClient()

    const handleDelete = async () => {
        for (let i = 0; i < selectedRows.length; i++) {
            let typeOfEvent = ressourceType === 'template' ? 'template_events' : 'campaign_events'
            deleteEvent(selectedRows[i],
                queryClient.invalidateQueries([typeOfEvent]), typeOfEvent)
        }
    }

    return (
        <div className='table-header'>
            <div>
                <label>
                    <input type='checkbox'
                        checked={selectedRows.length === events.length}
                        onChange={handleSelectAll} />Select all
                </label>
                <button
                    onClick={handleDelete}
                    disabled={selectedRows.length === 0}>
                    {deleteEventMutation.isLoading
                        ? <Spinner />
                        : <FontAwesomeIcon icon={faTrash} />
                    }
                </button>
            </div>
            <Row
                row={ressourceType === 'template'
                    ? templateObject
                    : { ...templateObject, completed: 'completed' }}
                keys={keys}
                isHeader={true}
            />
        </div>
    )
}

export default TableHeader
