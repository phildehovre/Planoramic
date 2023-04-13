import React from 'react'
import Row from './Row';

function TableHeader(props: {
    ressource: any,
    ressourceType: string | undefined
    selectedRows: any,
    setSelectedRows: any,
    events: any
}) {
    const {
        ressource,
        ressourceType,
        selectedRows,
        setSelectedRows,
        events
    } = props;

    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys, 'completed']

    const templateObject = {
        description: 'Description',
        position: 'Position',
        category: 'Category',
        entity_responsible: 'Entity Responsible',
        type: 'Type'
    }
    const keys = props.ressourceType === 'template' ? templateKeys : campaignKeys;

    const handleSelectAll = () => {
        if (selectedRows.length !== events.length) {
            setSelectedRows(events?.map((event: any) => {
                return ressourceType === 'template' ? event.id : event.event_id
            }))
        } else {
            setSelectedRows([])
        }
    }

    return (
        <div className='table-header'>
            <input type='checkbox'
                checked={selectedRows.length === events.length}
                onChange={handleSelectAll} />
            <Row
                row={ressourceType === 'template'
                    ? templateObject
                    : { ...templateObject, completed: 'completed' }}
                keys={keys}
                isHeader={true}
            />
        </div>
    )
}

export default TableHeader