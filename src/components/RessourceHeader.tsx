import React from 'react'
import { Spinner } from 'react-bootstrap'
import { supabase } from '../App'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@supabase/auth-helpers-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTemplateEvents } from '../util/db'
import { formatTemplateEventsToCampaign } from '../utils/helpers'
import TemplateDescriptionEdit from './Modals/TemplateDescriptionEdit'
import Modal from './Modal'
import Dropdown from './Dropdown'
import NewCampaignFromTemplate from './Modals/NewCampaignFromTemplate'
import './RessourceHeader.scss'

const schema = yup.object().shape({
    artistName: yup.string().required('You must enter a name'),
    songName: yup.string().required('You must enter a name'),
    targetDate: yup.string().required('Select a type of task'),
})

function RessourceHeader(props: any) {

    const [showEditDescriptionModal, setShowEditDescriptionModal] = React.useState(false)
    const [description, setDescription] = React.useState('')
    const [showNewCampaignModal, setShowNewCampaignModal] = React.useState(false)
    const [showDropdown, setShowDropdown] = React.useState(false)
    const [targetDate, setTargetDate] = React.useState<Date>(dayjs().add(1, 'month').toDate())
    const { ressource, ressourceType } = props
    const queryClient = useQueryClient()

    const navigate = useNavigate()
    const session = useSession()
    const { register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const { selectedTemplateId, setSelectedTemplateId } = React.useContext(selectedTemplateContext)
    const { selectedCampaignId, setSelectedCampaignId } = React.useContext(selectedCampaignContext)
    const { data: templateEventsData, isLoading, error } = useTemplateEvents(selectedTemplateId)

    const ressourceId = ressourceType === 'template' ? ressource?.data?.template_id : ressource?.data?.campaign_id
    const ressourceKey = ressourceType === 'template' ? 'template' : 'campaign'

    // ================= Update description =================

    const updateCellFn = async ({ id, key, val }: any) => {
        return await supabase
            .from(`${ressourceType}s`)
            .update({ [key]: val })
            .eq(ressourceKey + '_id', id)
            .select()
    }

    const updateCell = useMutation({
        mutationFn: ({ id, key, val }: any) => updateCellFn({ id, key, val })
    });

    const submitDescription = async (description: string) => {
        updateCell.mutateAsync({ id: ressourceId, key: 'description', val: description })
            .then(() => queryClient.invalidateQueries({ queryKey: [ressourceKey, { [`${ressourceKey}_id`]: ressourceId }] })
            );
    };


    // ================= New campaign from template =================

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

    const onSubmit = (data: any) => {
        setSelectedTemplateId(selectedTemplateId)
        const campaignSansDate = {

            'name': data.artistName + ' - ' + data.songName,
            'description': `Template: ${ressource.data.name}`,
            'template_id': selectedTemplateId,
            'campaign_id': uuidv4(),
            'author_id': session?.user.id,
            'artist_name': data.artistName,
            'song_name': data.songName,
            'target_date': data.targetDate,
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
            queryClient.invalidateQueries({ queryKey: ['campaigns'] })
            setShowNewCampaignModal(false)
            var campaignId = res.data[0].campaign_id
            setSelectedCampaignId(campaignId)
            const templateEventsFormatted = formatTemplateEventsToCampaign(templateEventsData?.data as any, campaignId)
            copyTemplateEventsToCampaignEvents.mutateAsync(templateEventsFormatted)
            navigate(`/dashboard/campaign/${campaignId}`)

        })
            .catch(err => alert(err))
    };

    // ================= Delete ressource =================

    const deleteRessourceFn = async () => {
        const res = await supabase
            .from(`${ressourceType}s`)
            .delete()
            .eq('id', ressource.data.id)
        return res
    }
    const deleteRessourceMutation = useMutation(deleteRessourceFn, {})

    const handleDeleteRessource = async () => {
        await deleteRessourceMutation.mutateAsync().then(() => {
            queryClient.invalidateQueries([`${ressourceType}s`])
            navigate(`/dashboard/${ressourceType}`)
        }
        )
        setShowEditDescriptionModal(false)
    }
    const onOptionClick = (option: string) => {
        if (option === 'New campaign from Template') {
            setShowNewCampaignModal(true)
        } else if (option === 'Delete') {
            handleDeleteRessource()
        }
        setShowDropdown(false)
    }


    const renderHeader = () => {
        return (
            <div className="ressource-header">
                <span className='title-ctn' style={{ position: 'relative' }}>
                    <h2>{ressource.data.name}</h2>
                    <div className='dropdown-container'>
                        <FontAwesomeIcon
                            icon={faEllipsis}
                            size='2x'
                            onClick={() => setShowDropdown(!showDropdown)} />
                        {
                            showDropdown &&
                            <Dropdown
                                options={[
                                    'New campaign from Template',
                                    'Delete'
                                ]}
                                onOptionClick={onOptionClick}
                                setIsOpen={setShowDropdown}
                            />
                        }

                    </div>
                </span>
                <p onClick={() => setShowEditDescriptionModal(true)}>
                    {ressource.data.description || `Add your template's description here`}</p>
                {
                    ressourceType === 'campaign' &&
                    <div className='campaign_info-ctn'>
                        <span>
                            <h4>Artist:</h4>
                            <p>{ressource.data.artist_name}</p>
                        </span>
                        <span>
                            <h4>Song:</h4>
                            <p>{ressource.data.song_name}</p>
                        </span>
                        <span>
                            <h4>Target date:</h4>
                            <p>{ressource.data.target_date}</p>
                        </span>
                    </div>
                }
            </div>
        )
    };

    return (
        <>
            {
                showEditDescriptionModal && <Modal
                    onClose={() => { console.log('closing') }}
                    showFooter={true}
                    onSave={() => { submitDescription(description) }}
                    showModal={showEditDescriptionModal}
                    setShowModal={setShowEditDescriptionModal}
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
                showNewCampaignModal && <Modal
                    onClose={() => { console.log('closing') }}
                    onSave={() => { handleSubmit(onSubmit) }}
                    showModal={showNewCampaignModal}
                    setShowModal={setShowNewCampaignModal}
                    title={`New Campaign from ${ressource?.data.name}`}
                    content={<NewCampaignFromTemplate
                        ressource={ressource}
                        placeholder='Describe this template'
                        ressourceType={ressourceType}
                        onSubmit={onSubmit}
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