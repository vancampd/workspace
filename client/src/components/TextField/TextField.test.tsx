import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import CheckboxGroup from '../CheckboxGroup';
import SelectField from '../SelectField';
import TextField from './TextField';

function TestForm() {
    const methods = useForm({ defaultValues: { city: '', state: '', periods: [] } });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(() => {})}>
                <TextField
                    name='city'
                    label='*City:'
                    placeholder='City'
                    rules={{ required: 'You must enter the city' }}
                />
                <SelectField
                    name='state'
                    label='*State:'
                    placeholder='Please select'
                    options={['Ohio', 'Texas']}
                    rules={{ required: 'You must select a state' }}
                />
                <CheckboxGroup
                    name='periods'
                    label='Periods'
                    options={['Daily', 'Weekly']}
                    rules={{ validate: (value: string[]) => value.length > 0 || 'Pick a period' }}
                />
                <button type='submit'>Submit</button>
            </form>
        </FormProvider>
    )
}

describe('form field components', () => {
    it('links field errors to their controls for assistive tech', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        expect(screen.getByLabelText('*City:')).not.toHaveAttribute('aria-invalid');

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        const city = screen.getByLabelText('*City:');
        const state = screen.getByLabelText('*State:');
        const daily = screen.getByLabelText('Daily');

        expect(city).toHaveAttribute('aria-invalid', 'true');
        expect(document.getElementById(city.getAttribute('aria-describedby')!))
            .toHaveTextContent('You must enter the city');
        expect(state).toHaveAttribute('aria-invalid', 'true');
        expect(document.getElementById(state.getAttribute('aria-describedby')!))
            .toHaveTextContent('You must select a state');
        expect(daily).toHaveAttribute('aria-invalid', 'true');
        expect(document.getElementById(daily.getAttribute('aria-describedby')!))
            .toHaveTextContent('Pick a period');
        expect(screen.getAllByRole('alert')).toHaveLength(3);

        await user.type(city, 'Austin');

        expect(city).not.toHaveAttribute('aria-invalid');
        expect(city).not.toHaveAttribute('aria-describedby');
    });
});
