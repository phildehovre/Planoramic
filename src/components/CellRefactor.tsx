import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';


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
    const submitButtonRef: React.MutableRefObject<any> = useRef()

    const handleCellClick = () => {
        setEventId(eventId)
        setIsEditing(true)
    }


    async function handleFormSubmit(data: any) {
        await handleSubmit(onSubmit)(data);
        // This code will execute after the handleSubmit Promise is resolved
        setIsEditing(false)
    }

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


    const submitButtonStyle = {
        border: 'none',
        borderRadius: '100px',
        height: '2em',
        width: '2em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    return (
        <form className={`cell-ctn ${isEditing ? 'isEditing' : ''} ${label}`}
            onClick={() => handleCellClick()}
            onSubmit={handleFormSubmit}
            ref={cellRef}
        >
            {isEditing
                ?
                <>
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
                    <button type='submit' ref={submitButtonRef}
                        style={submitButtonStyle}
                        title='Validate changes'
                    >
                        <FontAwesomeIcon icon={faCircleCheck} color='lightgreen' size='2x' />
                    </button>
                </>
                : value
            }
        </form>
    )
}

export default Cell