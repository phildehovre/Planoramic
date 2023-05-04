import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import Select from './Select';
import { SelectOptions } from '../assets/selectOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { convertPositionToDate } from '../utils/helpers';

function Cell(props: {
    value: any,
    label: string,
    onSubmit: any,
    setEventId: any,
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

    // console.log(label === 'entity_responsible' ? isEditing : '')
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

    const handleCellClick = () => {
        setEventId(eventId)
        setIsEditing(true)
    }

    const onOptionClick = async (value: string) => {
        try {
            await setEventId(eventId); // assuming eventId is declared somewhere
            setValue(label, value);
            await handleSubmit(onSubmit)();
            console.log('then');
        } catch (error) {
            // handle error
        }
    };


    async function handleFormSubmit(data: any) {
        await handleSubmit(onSubmit)(data);
        // This code will execute after the handleSubmit Promise is resolved
        setIsEditing(false)
    }

    const renderCell = () => {
        if (label === 'entity_responsible'
            || label === 'type'
            || label === 'position_units') {
            // if (isEditing) {
            return (<Select
                label={label}
                onOptionClick={onOptionClick}
                options={SelectOptions[label]}
                isOpen={isEditing}
                setIsEditing={setIsEditing}
                register={register}
                value={value}
                handleCellClick={handleCellClick}
            />)
            // }
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
                    placeholder={value || label}
                    {...register(label)}
                    name={label}
                />
            )
        }
        return value
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