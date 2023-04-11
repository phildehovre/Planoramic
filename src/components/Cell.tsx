import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';

function Cell(props: { value: any, label: string, onSubmit: any, setEventId?: any, eventId?: any }) {

    const [isEditing, setIsEditing] = React.useState(false);
    const [data, setData] = React.useState<any>();
    const { register, handleSubmit } = useForm()

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


    async function handleFormSubmit(data: any) {
        await handleSubmit(onSubmit)(data);
        // This code will execute after the handleSubmit Promise is resolved
        setIsEditing(false)
    }

    return (
        <form className={`cell-ctn ${isEditing ? 'isEditing' : ''} ${label}`}
            onClick={() => handleCellClick()}
            onSubmit={handleFormSubmit}
            ref={cellRef}
        >
            {isEditing
                ? <input
                    autoFocus
                    autoComplete='off'
                    className={`cell-ctn ${label}`}
                    type={typeof value === 'number' ? 'number' : 'text'}
                    defaultValue={value}
                    placeholder={value || label}
                    {...register(label)}
                    name={label}
                />
                : value
            }
        </form>
    )
}

export default Cell