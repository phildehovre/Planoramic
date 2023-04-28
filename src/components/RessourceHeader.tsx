import React from 'react'
import './RessourceHeader.scss'
import { Spinner } from 'react-bootstrap'
import Modal from './Modal'
import TemplateDescriptionEdit from './Modals/TemplateDescriptionEdit'
import { supabase } from '../App'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@supabase/auth-helpers-react'
import dayjs from 'dayjs'
import { formatTemplateEventsToCampaign } from '../utils/helpers'
import { useTemplateEvents } from '../util/db'
import DeleteRessource from './DeleteRessource'

function RessourceHeader(props: any) {

    const [showModal, setShowModal] = React.useState(false)
    const [description, setDescription] = React.useState('')
    const [showNewCampaignModal, setShowNewCampaignModal] = React.useState(false)
    const [targetDate, setTargetDate] = React.useState<Date>(dayjs().add(1, 'month').toDate())
    const { ressource, ressourceType } = props

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const session = useSession()

    const { selectedTemplateId, setSelectedTemplateId } = React.useContext(selectedTemplateContext)
    const { selectedCampaignId, setSelectedCampaignId } = React.useContext(selectedCampaignContext)
    const { data: templateEventsData, isLoading, error } = useTemplateEvents(selectedTemplateId)

    const ressourceId = ressourceType === 'template' ? ressource?.data?.template_id : ressource?.data?.campaign_id
    const ressourceKey = ressourceType === 'template' ? 'template' : 'campaign'


    const updateCellFn = async ({ id, key, val }: any) => {
        return await supabase
            .from(ressourceType)
            .update({ [key]: val })
            .eq(ressourceKey + '_id', id)
            .select()
    }

    const updateCell = useMutation({
        mutationFn: ({ id, key, val }: any) => updateCellFn({ id, key, val })
    });

    const submitDescription = async (description: string) => {
        updateCell.mutateAsync({ id: ressourceId, key: 'description', val: description })
            .then(() => {
                queryClient.invalidateQueries({ queryKey: [ressourceKey, { id: ressourceId }] })
            });
    };

    const addCampaign = useMutation({
        mutationFn: async (campaign: any) => await supabase
            .from('campaigns')
            .insert(campaign)
            .select(),
    });

    const addDateToCampaign = (campaign: any, targetDate: Date) => {
        campaign.targetDate = targetDate
        return campaign
    }

    const copyTemplateEventsToCampaignEvents = useMutation({
        mutationFn: async (templateEvents: any) => {
            await supabase
                .from('campaign_events')
                .insert(templateEvents)
        }
        // ==================Add all template events to campaign events ==============
    })

    const onSubmit = () => {
        setSelectedTemplateId(selectedTemplateId)
        const campaignSansDate = {
            'name': `New Campaign from ${ressource.data.name}`,
            'description': ressource.data.description,
            'template_id': selectedTemplateId,
            'campaign_id': uuidv4(),
            'author_id': session?.user.id
        };


        const campaign = addDateToCampaign(campaignSansDate, targetDate)

        addCampaign.mutateAsync(campaign).then((res) => {
            if (res.data !== null) {
                var campaignId = res.data[0].campaign_id
                var templateId = res.data[0].template_id

                sessionStorage.setItem('campaign_id', campaignId)
                sessionStorage.setItem('template_id', templateId)

            }
            return res

        }).then((res: any) => {
            console.log(res)
            queryClient.invalidateQueries({ queryKey: ['campaigns'] })
            var campaignId = res.data[0].campaign_id
            setSelectedCampaignId(campaignId)
            const templateEventsFormatted = formatTemplateEventsToCampaign(templateEventsData?.data as any, campaignId)
            copyTemplateEventsToCampaignEvents.mutateAsync(templateEventsFormatted)
            navigate(`/dashboard/campaign/${campaignId}`)

        })
            .catch(err => alert(err))
    };

    const renderHeader = () => {
        return (
            <div className="ressource-header">
                <h2>{ressource.data.name}</h2>
                <p onClick={() => setShowModal(true)}>
                    {ressource.data.description || `Add your template's description here`}</p>
                {ressourceType === 'template' && <button title='Create a new campaign from this template'
                    onClick={() => onSubmit()}
                >Create campaign</button>}
                <DeleteRessource
                    ressource={ressource}
                    ressourceType={ressourceType}
                />
            </div>
        )
    };

    return (
        <>
            {
                showModal && <Modal
                    onClose={() => { console.log('closing') }}
                    onSave={() => { submitDescription(description) }}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    title={`${ressourceKey[0].toUpperCase() + ressourceKey.slice(1)} description`}
                    content={<TemplateDescriptionEdit
                        description={description}
                        ressource={ressource}
                        setDescription={setDescription}
                        placeholder='Describe this template'
                    />}
                />
            }
            {
                !ressource || ressource.isLoading
                    ? <Spinner />
                    : renderHeader()

            }

        </>
    )
}

export default RessourceHeader