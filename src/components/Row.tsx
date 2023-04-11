import React, { useEffect, useRef } from 'react'
import Cell from './Cell'

function Row(props: { row: any, keys: string[], onSubmit?: any, setEventId?: any }) {

    const { row, keys, onSubmit, setEventId } = props;

    const renderCells = () => {
        return keys.map((key: string) => {
            return (
                <Cell
                    key={key}
                    value={row[key]}
                    label={key}
                    onSubmit={onSubmit}
                    setEventId={setEventId}
                    eventId={row.id}
                />
            )
        }
        )
    }

    return (
        <div className='row-ctn'>
            {renderCells()}
        </div>
    )
}

export default Row