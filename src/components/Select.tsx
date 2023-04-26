

import React, { useEffect, useState } from 'react';
import { OptionList, OptionItem, Label, SelectInput, Container } from '../styles/SelectStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';


function CustomSelect({
    label,
    options,
    register,
    isDisabled = false,
    defaultValue = '',
    onOptionClick,
    setIsEditing,
    // isOpen
}: any) {

    const [isOpen, setIsOpen] = useState(true);


    const handleOptionClick = (value: string) => {
        onOptionClick(value)
        setIsEditing(false);
        setIsOpen(false)
    };

    return (
        <Container>
            <Label htmlFor={label}>{label}</Label>
            <SelectInput
                type="text"
                placeholder={label}
                value={label}
                onClick={() => setIsOpen(!isOpen)}
                readOnly
                disabled={isDisabled}
                ref={register}
            />
            <FontAwesomeIcon icon={faAngleDown} color='black' />
            {isOpen && (
                <OptionList>
                    {options.map((option: any) => (
                        <OptionItem
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            isSelected={option.value === defaultValue}
                        >
                            {option.label}
                        </OptionItem>
                    ))}
                </OptionList>
            )}
        </Container>
    );
}

export default CustomSelect
