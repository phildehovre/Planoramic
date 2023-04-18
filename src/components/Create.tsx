import React from 'react'
import Table from './Table'
import { useParams } from 'react-router-dom'
import './Create.scss'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import NewRessource from './Modals/NewRessource'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../App'
import { v4 as uuidv4 } from 'uuid'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'

function Create() {
    const navigate = useNavigate()

    const [showModal, setShowModal] = React.useState(false)
    const [ressourceType, setRessourceType] = React.useState('')
    const [name, setName] = React.useState('New ressource')

    const { setSelectedTemplateId } = React.useContext(selectedTemplateContext)
    const { setSelectedCampaignId } = React.useContext(selectedCampaignContext)

    const handleCreateRessource = (ressourceType: string) => {
        addRessource.mutateAsync([{ name: name, created_at: new Date(), [`${ressourceType}_id`]: uuidv4() }])
            .then((res) => {
                console.log
                if (ressourceType === 'template' && res.data) {
                    setSelectedTemplateId(res?.data[0].template_id)
                    navigate(`/dashboard/template/${res?.data[0].template_id}`)
                }
                if (ressourceType === 'campaign' && res.data) {
                    setSelectedCampaignId(res?.data[0].campaign_id)
                    navigate(`/dashboard/campaign/${res?.data[0].campaign_id}`)
                }

            })
    }


    const addRessource = useMutation({
        mutationFn: async (event: any) => await supabase
            .from(`${ressourceType}s`)
            .insert(event)
            .select(),
    });

    const handleOpenModalWithRessource = (ressourceType: string) => {
        setShowModal(true)
        setRessourceType(ressourceType)
    }


    return (
        <div className='create-page'>
            <button onClick={() => handleOpenModalWithRessource('template')}>New Template</button>
            <button onClick={() => handleOpenModalWithRessource('campaign')}>New Campaign</button>
            <Modal
                showModal={showModal}
                onSave={() => handleCreateRessource(ressourceType)}
                onClose={() => setShowModal(false)}
                title={`Create ${ressourceType}`}
                content={<NewRessource name={name} setName={setName} />}
                setShowModal={setShowModal}

            />
        </div>
    )
}

export default Create