import React, { useEffect, useRef } from 'react';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import './Select.scss';
import SelectItem from './SelectItem';

const useOnClickOutside = (ref: React.RefObject<any>, handler: (event: MouseEvent | TouchEvent) => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const CustomSelect = (props: {
    label: string,
    options: { label: string, value: string }[],
    register: any,
    onOptionClick: (value: string) => void,
    setIsEditing: (bool: boolean) => void,
    isOpen: boolean,
}) => {

    const { label, options, register, onOptionClick, setIsEditing, isOpen } = props;
    const [selectedValue, setSelectedValue] = React.useState('');
    const selectRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(selectRef, () => {
        setIsEditing(false);
    });

    const handleOptionClick = (value: string) => {
        setSelectedValue(value);
        onOptionClick(value)
        setIsEditing(false);
    };

    return (
        <Select.Root
            onValueChange={(e) => { handleOptionClick(e) }}
        >
            <Select.Trigger className="SelectTrigger" aria-label="Food">
                <Select.Value placeholder="Select an entity…" />
                <Select.Icon className="SelectIcon">
                    <ChevronDownIcon />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="SelectContent">
                    <Select.ScrollUpButton className="SelectScrollButton">
                        <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="SelectViewport">
                        <Select.Group>
                            <Select.Label className="SelectLabel">Who</Select.Label>
                            {options.map((option, index) => {
                                return (
                                    <SelectItem
                                        key={index}
                                        value={option.value}
                                        className={classnames('SelectItem', option.value === 'banana' && 'SelectItem--selected')}
                                    >
                                        {option.label}
                                    </SelectItem>
                                );
                            })
                            }
                        </Select.Group>
                        <Select.Separator className="SelectSeparator" />
                    </Select.Viewport>
                    <Select.ScrollDownButton className="SelectScrollButton">
                        <ChevronDownIcon />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root >
    );
}

export default CustomSelect;
