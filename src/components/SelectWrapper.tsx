import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Container } from '../styles/SelectStyles';
import Select from './Select';

interface FormValues {
    mySelect: string;
}

const SelectWrapper: React.FC = (props: { options: string[], label: string }) => {
    const methods = useForm<FormValues>();
    const { handleSubmit, setValue } = methods;

    const { options } = props

    const onSubmit = (data: FormValues) => {
        console.log(data);
    };

    const onOptionClick = (value: string) => {
        setValue('mySelect', value);
        handleSubmit(onSubmit)();
    };

    return (
        <Container>
            <h1>My Form</h1>
            <FormProvider {...methods}>
                <form>
                    <Select
                        name="mySelect"
                        label="Select an option"
                        options={options}
                        onOptionClick={onOptionClick} />
                </form>
            </FormProvider>
        </Container>
    );
};

export default SelectWrapper;
