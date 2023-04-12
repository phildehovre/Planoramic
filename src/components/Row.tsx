import React, { useEffect, useRef } from 'react'
import Cell from './Cell'

function Row(props: {
    row: any,
    keys: string[],
    onSubmit?: any,
    setEventId?: any,
    isHeader?: boolean
    selectedRows?: any,
    setSelectedRows?: any
}) {

    const {
        row,
        keys,
        onSubmit,
        setEventId,
        isHeader,
        selectedRows,
        setSelectedRows
    } = props;

    const eventId = row.event_id || row.id

    const handleRowSelection = () => {
        if (selectedRows.includes(eventId)) {
            setSelectedRows(selectedRows.filter((id: any) => id !== eventId))
        } else {
            setSelectedRows([...selectedRows, eventId])
        }
    }

    const renderCells = () => {
        return keys.map((key: string) => {
            return (
                <Cell
                    key={key}
                    value={row[key]}
                    label={key}
                    onSubmit={onSubmit}
                    setEventId={setEventId}
                    eventId={eventId}
                />
            )
        }
        )
    }

    return (
        <div className='row-ctn'>
            {!isHeader && <input type='checkbox' checked={selectedRows.includes(eventId)}
                onChange={handleRowSelection} />}
            {renderCells()}
        </div>
    )
}

export default Row