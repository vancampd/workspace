import type { ReactNode } from 'react';
import {
    get,
    useFormContext,
    type FieldError,
    type RegisterOptions,
} from 'react-hook-form';
import FormError from '../FormError';

type CheckboxOption = string | { value: string; label?: string; id?: string };

type CheckboxGroupProps = {
    name: string;
    label: ReactNode;
    options: CheckboxOption[];
    rules?: RegisterOptions<any, any>;
};

function CheckboxGroup({ name, label, options, rules }: CheckboxGroupProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const error = (get(errors, name) as FieldError | undefined)?.message;
    const errorId = `${name}-error`;

    return (
        <>
            <label className='form__label'>{label}</label>
            <div className='form__check-box-container'>
                {options.map((option) => {
                    const { value, label: optionLabel = value, id = value } =
                        typeof option === 'string' ? { value: option } : option;

                    return (
                        <label className='form__label' key={value}>
                            <input
                                className='form__input'
                                id={id}
                                value={value}
                                type='checkbox'
                                aria-invalid={error ? true : undefined}
                                aria-describedby={error ? errorId : undefined}
                                {...register(name, rules)}
                            />
                            {optionLabel}
                        </label>
                    )
                })}
                {error ? <FormError id={errorId}>{error}</FormError> : ''}
            </div>
        </>
    )
}

export default CheckboxGroup
