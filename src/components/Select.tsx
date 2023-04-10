import React, { useEffect, useState } from 'react';
import { UseFormRegister, useFormContext } from 'react-hook-form';
import { SelectWrapper, OptionList, OptionItem, Label, SelectInput } from '../styles/SelectStyles';


function CustomSelect({
    label,
    options,
    register,
    setValue,
    placeholder = '',
    isDisabled = false,
    defaultValue = '',
    onOptionClick,
}: any) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (value: string) => {
        onOptionClick(value)
        setIsOpen(false);
    };

    return (
        <SelectWrapper>
            <Label htmlFor={label}>{label}</Label>
            <SelectInput
                type="text"
                placeholder={placeholder}
                value={defaultValue}
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
        </SelectWrapper>
    );
}

export default CustomSelect