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
import { formatRessourceObjectForSubmission } from '../utils/ressourceObjectFormatter';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import Modal from './Modal';
import NewPhase from './Modals/NewPhase';

function TableHeader(props: {
    ressource: any,
    ressourceType: string | undefined
    selectedRows: any,
    setSelectedRows: any,
    events: any,
    phases: number[]
}) {
    const {
        ressource,
        ressourceType,
        selectedRows,
        setSelectedRows,
        events,
        phases
    } = props;

    const [showModal, setShowModal] = React.useState(false);
    const [phaseName, setPhaseName] = React.useState('');
    const [phaseNumber, setPhaseNumber] = React.useState(phases.length + 1);

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
    const typeOfEvent = ressourceType === 'template' ? 'template_events' : 'campaign_events'

    const session = useSession()
    const params = useParams()

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
            deleteEvent(selectedRows[i],
                queryClient.invalidateQueries([typeOfEvent]), typeOfEvent)
        }
    }

    const addRessource = useMutation({
        mutationFn: async (event: any) => await supabase
            .from(typeOfEvent)
            .insert(event)
            .select(),
    });


    const { selectedTemplateId } = useContext(selectedTemplateContext)
    const { selectedCampaignId } = useContext(selectedCampaignContext)

    const handleCreatePhaseWithEvent = (phaseName: string, phaseNumber: number) => {
        // const data = formatRessourceObjectForSubmission(keys, formData)
        let event = {
            description: 'First event',
            author_id: session?.user.id,
            created_at: dayjs().format(),
            phase_number: phaseNumber || null,
            phase_name: phaseName || '',
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
        })
    }

    return (
        <div className='table-header'>
            <label>
                <input type='checkbox'
                    checked={selectedRows.length === events.length}
                    onChange={handleSelectAll} />Select all
            </label>
            <button
                title='Create a new phase'
                onClick={() => { setShowModal(true) }}
            >
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
            {
                showModal && <Modal
                    onClose={() => { console.log('closing') }}
                    onSave={() => { handleCreatePhaseWithEvent(phaseName, phaseNumber) }}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    title={`Create a new phase`}
                    content={<NewPhase
                        ressource={ressource}
                        phaseName={phaseName}
                        setPhaseName={setPhaseName}
                        setPhaseNumber={setPhaseNumber}
                        phaseNumber={phaseNumber}
                        placeholder='Name of the phase'
                    />}
                />
            }
        </div >
    )
}

export default TableHeader
