import React, { useEffect, useRef } from 'react'
import Cell from './Cell'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { convertPositionToDate } from '../utils/helpers';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

function Row(props: {
    row: any,
    keys?: string[],
    onSubmit?: any,
    setEventId: any,
    isHeader?: boolean
    selectedRows?: any,
    setSelectedRows?: any
    isNew?: boolean
}) {


    const {
        row,
        keys,
        onSubmit,
        setEventId,
        isHeader,
        selectedRows,
        setSelectedRows,
        isNew
    } = props;

    const ref = useRef<HTMLDivElement | null>()

    const [hovering, setHovering] = React.useState(null)
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

    const eventId = row.id

    const handleRowSelection = () => {
        if (selectedRows.includes(eventId)) {
            setSelectedRows(selectedRows.filter((id: any) => id !== eventId))
        } else {
            setSelectedRows([...selectedRows, eventId])
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    const renderCells = () => {
        return keys?.map((key: string) => {
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
        <div className='row-ctn'
            onMouseEnter={() => setHovering(row.id)}
            onMouseLeave={() => setHovering(null)}
        >
            {!isHeader && !isNew &&
                <div className='checkbox-ctn'>

                    <Checkbox.Root
                        className="CheckboxRoot"
                        checked={selectedRows.includes(eventId)}
                        onCheckedChange={handleRowSelection}
                    >
                        <Checkbox.Indicator className="CheckboxIndicator">
                            <CheckIcon />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                </div>
            }
            {renderCells()}
            {hovering === row.id &&
                <span
                    className='row-ellipsis'
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </span>}
            {isDropdownOpen &&
                <div className='dropdown-ctn'
                    // @ts-ignore
                    ref={ref}
                >
                    <button>Duplicate</button>
                    <button onClick={() => { console.log('Delete') }}>Delete</button>
                </div>}
        </div >
    )
}

export default Row