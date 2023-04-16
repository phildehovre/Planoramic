

import React, { useEffect, useState } from 'react';
import { UseFormRegister, useFormContext } from 'react-hook-form';
import { SelectWrapper, Dropdown, OptionList, OptionItem, Label, SelectInput } from '../styles/SelectStyles';


function CustomSelect({
    label,
    options,
    register,
    setValue,
    placeholder = '',
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
        setIsOpen
    };

    return (
        <>
            {/* <Label htmlFor={label}>{label}</Label>
            <SelectInput
                type="text"
                placeholder={label}
                value={label}
                onClick={() => setIsOpen(!isOpen)}
                readOnly
                disabled={isDisabled}
                ref={register}
            />
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
            )} */}
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
        </>
    );
}

export default CustomSelect
