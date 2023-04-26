import React, { useEffect } from 'react'
import './Dropdown.scss'

function Dropdown(props: {
    options: string[],
    onOptionClick: (option: string) => void
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {

    const {
        options,
        onOptionClick,
        setIsOpen
    } = props

    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);



    const renderOptions = () => {
        return options.map((option: string) => {
            return (
                <div
                    className='option-ctn'
                    onClick={() => { onOptionClick(option) }}
                    key={option}
                >{option}</div>
            )
        });
    }

    return (
        <div className='dropdown-ctn' ref={ref}>{renderOptions()}</div>
    )
}

export default Dropdown