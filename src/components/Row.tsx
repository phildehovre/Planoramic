import React from 'react'
import Cell from './Cell'

function Row(props: { row: any, keys: string[] }) {

    const { row, keys } = props;

    const renderCells = () => {

        return keys.map((key: string) => {
            return (
                <Cell key={key} value={row[key]} label={key} />
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