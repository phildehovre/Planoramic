import React from 'react'
import './RessourceHeader.scss'
import TestForm from './TestForm'
import { Spinner } from 'react-bootstrap'
import Modal from './Modal'
import TemplateDescriptionEdit from './Modals/TemplateDescriptionEdit'
import { supabase } from '../App'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function RessourceHeader(props: any) {

    const [showModal, setShowModal] = React.useState(false)
    const [description, setDescription] = React.useState('')

    const { ressource, ressourceType } = props

    const queryClient = useQueryClient()

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
            })

    }

    const renderHeader = () => {
        return (
            <div className="ressource-header">
                <h2>{ressource.data.name}</h2>
                <p onClick={() => setShowModal(true)}>
                    {ressource.data.description || `Add your template's description here`}</p>
            </div>
        )
    };

    return (
        <>
            {
                !ressource || ressource.isLoading
                    ? <Spinner />
                    : renderHeader()

            }
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

        </>
    )
}

export default RessourceHeader