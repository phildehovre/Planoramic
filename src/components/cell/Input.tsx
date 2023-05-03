import React, { forwardRef, Ref } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
    value: string
    label: string
    isEditing: boolean
    register: any
    setIsEditing: (label: string) => void
    onSubmit: any
}

const Input = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
    const {
        value,
        label,
        // register,
        isEditing,
        setIsEditing,
        onSubmit
    } = props

    const { handleSubmit, register } = useForm()

    const renderCell = () => {
        if (isEditing) {
            return (
                <input
                    autoFocus
                    autoComplete='off'
                    className={`${label}`}
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

    async function handleFormSubmit(data: any) {
        await handleSubmit(onSubmit)(data);
        // This code will execute after the handleSubmit Promise is resolved
        setIsEditing('')
    }

    return (
        <form
            onSubmit={handleFormSubmit}
            onClick={() => { setIsEditing(label) }}
            ref={ref}
        >
            {renderCell()}
        </form >
    )
})

export default Input
