import React, { useEffect } from 'react'
import Row from './Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import NewRow from './NewRow';

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
}) {

    const [isChecked, setIsChecked] = React.useState(false)

    const {
        name,
        events,
        number,
        rowProps,
        newRowProps
    } = props;

    const { keys, setSelectedRows, selectedRows } = rowProps;

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
            <h3>Phase {number}: {name} <FontAwesomeIcon icon={faEllipsis} /></h3>
            <div className='row-ctn'>
                <input type='checkbox' checked={isChecked} onChange={handleSelectAllPhaseEvents} />
                {renderColumnHeaders()}
            </div>
            {renderRows()}
            <NewRow
                {...newRowProps}
                phaseNumber={number}
                phaseName={name}
            />
        </div>
    )
}

export default Phase