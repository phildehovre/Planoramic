import React from 'react'
import Row from './Row';

function Phase(props: {
    name: string
    events: any
    number: number
    rowProps: object
}) {


    const {
        name,
        events,
        number,
        rowProps
    } = props;

    const renderRows = () => {
        let data = events?.sort((a: any, b: any) => b.position - a.position)
        return data?.map((row: any) => {
            console.log(row)
            return (<Row
                row={row}
                key={row.id}
                {...rowProps}
            />)
        });
    }

    return (
        <div className='phase-ctn'>
            <h3>{name}</h3>
            {renderRows()}
        </div>
    )
}

export default Phase