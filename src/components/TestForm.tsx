import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Container } from '../styles/SelectStyles';
import Select from './Select';

interface FormValues {
    mySelect: string;
}

const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
];

const MyForm: React.FC = () => {
    const methods = useForm<FormValues>();
    const { handleSubmit } = methods;

    const onSubmit = (data: FormValues) => {
        console.log(data);
    };

    const onOptionClick = (value: string) => {
        methods.setValue('mySelect', value);
        handleSubmit(onSubmit)();
    };

    return (
        <Container>
            <h1>My Form</h1>
            <FormProvider {...methods}>
                <form>
                    <Select name="mySelect" label="Select an option" options={options} onOptionClick={onOptionClick} />
                </form>
            </FormProvider>
        </Container>
    );
};

export default MyForm;
