import React from 'react'
import Row from './Row';

function Phase(props: {
    name: string
    events: any
    number: number
    rowProps: {
        keys: string[],
        setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>
        selectedRows: string[]
    }
}) {


    const {
        name,
        events,
        number,
        rowProps
    } = props;

    const { keys, setSelectedRows, selectedRows } = rowProps;

    const handleSelectAllPhaseEvents = () => {
        if (selectedRows.length !== events.length) {
            setSelectedRows(events?.map((event: any) => {
                return event.id
            }))
        } else {
            setSelectedRows([])
        }
    }

    const renderColumnHeaders = () => {
        return keys.map((key: string) => {
            return <div className='cell-ctn headers' key={key}>{key}</div>
        });
    }

    console.log(selectedRows)

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
            <h3>Phase {number}: {name}</h3>
            <div className='row-ctn'>
                <input type='checkbox' onChange={handleSelectAllPhaseEvents} />
                {renderColumnHeaders()}
            </div>
            {renderRows()}
        </div>
    )
}

export default Phase