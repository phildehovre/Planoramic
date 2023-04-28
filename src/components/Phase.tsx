import React, { useEffect } from 'react'
import Row from './Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import NewRow from './NewRow';
import Modal from './Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../App';
import Dropdown from './Dropdown';

function Phase(props: {
    name: string
    events: any
    number: number
    rowProps: {
        keys: string[],
        setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>
        selectedRows: string[]
    }
    newRowProps: any
    ressourceType: string | undefined
}) {

    const [isChecked, setIsChecked] = React.useState(false)
    const [showDropdown, setShowDropdown] = React.useState(false)
    const [modalCallback, setModalCallback] = React.useState<any>(null)
    const [modalPrompt, setModalPrompt] = React.useState('')
    const [showModal, setShowModal] = React.useState(false)

    const {
        name: phaseName,
        events,
        number: phaseNumber,
        rowProps,
        newRowProps,
        ressourceType
    } = props;

    const { keys, setSelectedRows, selectedRows } = rowProps;

    const queryClient = useQueryClient()

    useEffect(() => {
        if (selectedRows.length === 0 || !events.every((event: any) => selectedRows.includes(event.id))) {
            setIsChecked(false)
        }

        if (events.every((event: any) => selectedRows.includes(event.id))) {
            setIsChecked(true)
        }
    }, [selectedRows])


    const handleSelectAllPhaseEvents = () => {
        let phaseEvents = events?.map((event: any) => {
            return event.id
        })
        if (!isChecked) {
            setSelectedRows((prev) => [...prev, ...phaseEvents])
            setIsChecked(true)
        } else if (isChecked) {
            setSelectedRows((prev) => prev.filter((id: string) => !phaseEvents.includes(id)))
            setIsChecked(false)
        }
    }

    const deletePhaseMutation = useMutation(
        async () => {
            const res = await supabase
                .from(`${ressourceType}_events`)
                .delete()
                .eq('phase_name', phaseName)
                .eq('phase_number', phaseNumber)
            return res
        }
        , {})

    const deletePhase = () => {
        deletePhaseMutation.mutateAsync()
            .then((res) => queryClient.invalidateQueries([`${ressourceType}_events`]))
    }

    const duplicatePhaseMutation = useMutation(
        async () => {
            await supabase
                .from(`${ressourceType}_events`)
                .insert(events.map((event: any) => {
                    const { id, ...newEvent } = event
                    return {
                        ...newEvent,
                        phase_number: phaseNumber + 1,
                        phase_name: phaseName + ' (copy)',
                    }
                }),
                )
        }
    )

    const duplicatePhase = () => {
        duplicatePhaseMutation.mutateAsync()
            .then((res) => queryClient.invalidateQueries([`${ressourceType}_events`]))
    }

    const handleOptionClick = (option: string) => {
        setShowModal(true)
        if (option === 'Delete') {
            setModalCallback(() => deletePhase)
            setModalPrompt('Are you sure you want to delete this phase?')
        } else if (option === 'Duplicate') {
            duplicatePhase()
            setModalPrompt('')
        }
        setShowDropdown(false)
    }

    const renderColumnHeaders = () => {
        let labels: any = {
            description: 'Task',
            position: 'When',
            category: 'Category',
            entity_responsible: 'Who',
        }
        return keys.map((key: string) => {
            return <div className={`cell-ctn headers ${key}`} key={key}>{labels[key]}</div>
        });
    }

    const renderRows = () => {
        let data = events?.sort((a: any, b: any) => b.position - a.position)
        return data?.map((row: any) => {
            return (<Row
                row={row}
                key={row.id}
                {...rowProps}
            />)
        });
    }

    return (
        <div className='phase-ctn'>
            <h3>
                <input type='checkbox' checked={isChecked} onChange={handleSelectAllPhaseEvents} />
                Phase {phaseNumber}: {phaseName}
                <span style={{ position: 'relative', cursor: 'pointer', padding: '0 1.5em' }}>
                    <FontAwesomeIcon
                        icon={faEllipsis}
                        onClick={() => setShowDropdown(true)}
                    />
                    {showDropdown && <Dropdown
                        options={['Duplicate', 'Delete']}
                        onOptionClick={(option: string) => { handleOptionClick(option) }}
                        setIsOpen={setShowDropdown}
                    />}
                </span>
            </h3>
            <div className='row-ctn'>
                {renderColumnHeaders()}
            </div>
            {renderRows()}
            <NewRow
                {...newRowProps}
                phaseNumber={phaseNumber}
                phaseName={phaseName}
            />
            <Modal
                onClose={() => setShowModal(false)}
                onSave={modalCallback}
                title={modalPrompt}
                showModal={showModal && modalPrompt !== ''}
                setShowModal={setShowModal}
            />
        </div>
    )
}

export default Phase