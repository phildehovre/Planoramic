import React, { useContext } from 'react'
import Row from './Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMailForward, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postEvents, useDeleteEvent } from '../util/db';
import Spinner from './Spinner';
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext';
import { postEventsToGoogle } from '../apis/googleCalendar';
import { useSession } from '@supabase/auth-helpers-react'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext';
import { supabase } from '../App';
import { v4 as uuidv4 } from 'uuid'

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

    const { setSelectedTemplateId } = React.useContext(selectedTemplateContext)
    const { setSelectedCampaignId } = React.useContext(selectedCampaignContext)

    const mapSelectedEvents = () => {
        let selectedEvents
        if (selectedRows.length === 0) {
            selectedEvents = ressource?.data?.data
        } else {

            selectedEvents = ressource?.data?.data.filter((event: any) => {
                return selectedRows.includes(ressource?.data?.data.id)
            })
        }
        return selectedEvents
    }



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

    const session = useSession()

    const handleSelectAll = () => {
        if (selectedRows.length !== events.length) {
            setSelectedRows(events?.map((event: any) => {
                return ressourceType === 'template' ? event.id : event.id
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

    const handleCreateRessource = (type: string | undefined) => {
        addRessource.mutateAsync([{ name: name, created_at: new Date(), [`${type}_id`]: uuidv4() }])
            .then((res) => {
                console.log
                if (type === 'template' && res.data) {
                    setSelectedTemplateId(res?.data[0].template_id)
                }
                if (type === 'campaign' && res.data) {
                    setSelectedCampaignId(res?.data[0].campaign_id)
                }

            })
    }



    const addRessource = useMutation({
        mutationFn: async (event: any) => await supabase
            .from(`${ressourceType}s`)
            .insert(event)
            .select(),
    });

    return (
        <div className='table-header'>
            <div>
                <label>
                    <input type='checkbox'
                        checked={selectedRows.length === events.length}
                        onChange={handleSelectAll} />Select all
                </label>
                <button title='Create a new phase'>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                {ressourceType === 'campaign' && <button
                    onClick={() =>
                        postEventsToGoogle(mapSelectedEvents(), ressource?.data?.data[0].targetDate, session)
                    }
                >
                    {deleteEventMutation.isLoading
                        ? <Spinner />
                        : <FontAwesomeIcon icon={faMailForward} />
                    }
                </button>}
                <button
                    title='Delete selected rows'
                    onClick={handleDelete}
                    disabled={selectedRows.length === 0}>
                    {deleteEventMutation.isLoading
                        ? <Spinner />
                        : <FontAwesomeIcon icon={faTrash} />
                    }
                </button>
            </div>
        </div >
    )
}

export default TableHeader
