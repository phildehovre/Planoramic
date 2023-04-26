import React, { useEffect, useRef, useState } from 'react';
import './SelectRefactor.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

interface Option {
    label: string;
    value: string;
}

interface SelectRefactorProps {
    options: Option[];
    onOptionClick: (value: string) => void;
    register: any;
    setValue: any;
    label: string;
}

function SelectRefactor(props: SelectRefactorProps) {
    const { options, onOptionClick, register, setValue, label } = props;

    const [selectedOption, setSelectedOption] = useState<Option>({ label: '', value: '' });
    const [isOpen, setIsOpen] = useState(false);
    const [hovering, setHovering] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const handleOptionClick = (option: Option) => {
        onOptionClick(option.value);
        setValue(label, option.value);
        setSelectedOption(option);
        setIsOpen(false);
    };

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


    return (
        <div className="select-ctn" ref={ref} onClick={() => setIsOpen(!isOpen)}>
            <div className="selected-option">{selectedOption.label || <p>{label.split('_').join(' ')}</p>}</div>
            {isOpen && <div className={`options-ctn ${isOpen ? 'open' : ''}`}>
                {options.map((option) => (
                    <div
                        className={`option-item ${hovering === option.value ? 'hovering' : ''}`}
                        key={option.value}
                        onClick={() => handleOptionClick(option)}
                        onMouseEnter={() => setHovering(option.value)}
                        onMouseLeave={() => setHovering('')}
                    >
                        {option.label}
                    </div>
                ))}
            </div>}
        </div>
    );
}

export default SelectRefactor;
