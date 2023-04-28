import React from 'react'
import Modal from './Modal';
import { supabase } from '../App';
import { CampaignObj, TemplateObj } from '../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function DeleteRessource(props: {
    ressourceType: string
    ressource: any,
}) {

    const [showModal, setShowModal] = React.useState(false);

    const {
        ressourceType,
        ressource,
    } = props

    const queryClient = useQueryClient()
    const navigate = useNavigate()

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
        setShowModal(false)
    }

    return (
        <>
            <button title={`Delete this ${ressourceType}`}
                onClick={() => setShowModal(true)}
            >
                <FontAwesomeIcon icon={faTrash} />
            </button >
            {showModal &&
                <Modal
                    onClose={() => setShowModal(false)}
                    onSave={() => handleDeleteRessource()}
                    title={`Delete ${ressourceType}: ${ressource.data.name}?`}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    isLoading={deleteRessourceMutation.isLoading}
                />
            }
        </>
    )
}

export default DeleteRessource