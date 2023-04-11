import React from 'react'

function Cell(props: { value: any, label: string }) {

    const { value, label } = props;
    return (
        <div className={`cell-ctn ${label}`}>{value}</div>
    )
}

export default Cell