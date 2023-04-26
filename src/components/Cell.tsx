import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import Select from './Select';
import { SelectOptions } from '../assets/selectOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faAngleDown } from '@fortawesome/free-solid-svg-icons';

function Cell(props: {
    value: any,
    label: string,
    onSubmit: any,
    setEventId?: any,
    eventId?: any
}) {

    const [isEditing, setIsEditing] = React.useState(false);
    const [data, setData] = React.useState<any>();
    const { register, handleSubmit, setValue } = useForm()

    const {
        value,
        label,
        onSubmit,
        setEventId,
        eventId
    } = props;

    const cellRef: React.MutableRefObject<any> = useRef()

    useEffect(() => {
        window.addEventListener('click', (e) => {
            try {

                if (cellRef.current !== null && !cellRef.current.contains(e.target)) {
                    setIsEditing(false)
                }
            }
            catch (err) {
                console.log(err)
            }
        })
    }, [])

    const renderCell = () => {
        if (label === 'entity_responsible'
            || label === 'type'
            || label === 'position_units') {
            if (isEditing) {
                return (<Select
                    name={label}
                    onOptionClick={onOptionClick}
                    options={SelectOptions[label]}
                    isOpen={isEditing}
                    setIsEditing={setIsEditing}
                />)
            }
            return (
                <>
                    {SelectOptions[label].find((option: any) => option.value === value)?.label}
                    <FontAwesomeIcon icon={faAngleDown} />
                </>
            )
        }
        if (isEditing) {
            return (
                <input
                    autoFocus
                    autoComplete='off'
                    className={`cell-ctn ${label}`}
                    type={typeof value === 'number' ? 'number' : 'text'}
                    defaultValue={value}
                    placeholder={label}
                    {...register(label)}
                    name={label}
                />
            )
        }
        return value
    }

    const handleCellClick = () => {
        setEventId(eventId)
        setIsEditing(true)
    }

    const onOptionClick = (value: string) => {
        setEventId(eventId)
        setValue(label, value);
        handleSubmit(onSubmit)();
    };


    async function handleFormSubmit(data: any) {
        console.log(data)
        await handleSubmit(onSubmit)(data);
        // This code will execute after the handleSubmit Promise is resolved
        setIsEditing(false)
    }

    return (
        <form
            title='Click on this cell to edit'
            className={`cell-ctn ${isEditing ? 'isEditing' : ''} ${label}`}
            onClick={() => handleCellClick()}
            onSubmit={handleFormSubmit}
            ref={cellRef}
        >
            {renderCell()}
        </form>
    )
}

export default Cell