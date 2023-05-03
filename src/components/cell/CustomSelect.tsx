import React from 'react'
import SelectItem from '../SelectItem';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

function CustomSelect(props: {
    value: any,
    label: string,
    // onSubmit: any,
    register: any,
    SelectOptions: any,
    onOptionClick: (label: string, value: string) => void,
}) {


    const {
        value,
        label,
        SelectOptions,
        onOptionClick,
    } = props;


    const options = SelectOptions[label]

    const [selectedValue, setSelectedValue] = React.useState('');

    const handleOptionClick = (value: string) => {
        setSelectedValue(value);
        onOptionClick(label, value)
    };

    return (
        <Select.Root
            onValueChange={(e) => { handleOptionClick(e) }}
        >
            <Select.Trigger className="SelectTrigger" aria-label="Food">
                <Select.Value asChild={true}>
                    <span>
                        {value}
                    </span>
                </Select.Value>
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
                            {options.map((option: any, index: number) => {
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


export default CustomSelect