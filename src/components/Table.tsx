import React from 'react'
import Row from './Row'
import './Table.scss'
import Spinner from './Spinner';
import TableHeader from './TableHeader';

function Table(props: { ressource: any, ressourceType: string | undefined }) {

    const { ressource, ressourceType } = props;

    const templateKeys = ['description', 'position', 'category', 'entity_responsible', 'type']
    const campaignKeys = [...templateKeys, 'completed']

    const templateObject = {
        description: 'Description',
        position: 'Position',
        category: 'Category',
        entity_responsible: 'Entity Responsible',
        type: 'Type'
    }

    const keys = ressourceType === 'templates' ? templateKeys : campaignKeys;


    const renderRows = () => {
        let data = ressource?.data?.data.sort((a: any, b: any) => b.position - a.position)
        return data?.map((row: any) => {
            return <Row
                row={row}
                key={row.id}
                keys={keys}
            />
        });
    }

    return (
        <div className='table-ctn'>
            <TableHeader ressource={ressource} ressourceType={ressourceType} />
            {ressource.isLoading
                ? <Spinner />
                : renderRows()
            }
        </div>
    )
}

export default Table