import React from 'react'
import Row from './Row';

function TableHeader(props: { ressource: any, ressourceType: string | undefined }) {

    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys, 'completed']

    const templateObject = {
        description: 'Description',
        position: 'Position',
        category: 'Category',
        entity_responsible: 'Entity Responsible',
        type: 'Type'
    }

    const keys = props.ressourceType === 'templates' ? templateKeys : campaignKeys;

    const { ressource, ressourceType } = props;
    return (
        <div className='table-header'>
            <Row
                row={ressourceType === 'templates'
                    ? templateObject
                    : { ...templateObject, completed: 'completed' }}
                keys={keys}
            />
        </div>
    )
}

export default TableHeader