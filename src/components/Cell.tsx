import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import Select from './Select';
import { SelectOptions } from '../assets/selectOptions';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

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
        }
        if (label === 'completed') {
            <div className='checkbox-ctn' title='Select all events'>
                <Checkbox.Root
                    className="CheckboxRoot"
                    checked={value}
                    onCheckedChange={() => setValue(label, !value)}
                >
                    <Checkbox.Indicator className="CheckboxIndicator">
                        <CheckIcon className='CheckboxIcon' />
                    </Checkbox.Indicator>
                </Checkbox.Root>
            </div>
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
            className={`cell-ctn ${isEditing ? 'isEditing' : ''} ${label} ${value === null || value === undefined ? 'error' : ''}`}
            onClick={() => handleCellClick()}
            onSubmit={handleFormSubmit}
            ref={cellRef}
        >
            {renderCell()}
        </form>
    )
}

export default Cell