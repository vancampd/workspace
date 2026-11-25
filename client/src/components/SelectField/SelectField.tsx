import type { ReactNode, SelectHTMLAttributes } from 'react';
import {
    get,
    useFormContext,
    type FieldError,
    type RegisterOptions,
} from 'react-hook-form';
import FormField from '../FormField';

type SelectOption = string | { value: string; label: string };

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> & {
    name: string;
    label: ReactNode;
    options: SelectOption[];
    placeholder?: string;
    rules?: RegisterOptions<any, any>;
    id?: string;
};

function SelectField({
    name,
    label,
    options,
    placeholder,
    rules,
    id = name,
    ...selectProps
}: SelectFieldProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const error = (get(errors, name) as FieldError | undefined)?.message;
    const errorId = `${id}-error`;

    return (
        <FormField label={label} htmlFor={id} error={error} errorId={errorId}>
            <select
                className='form__select'
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                {...selectProps}
                {...register(name, rules)}
            >
                {placeholder !== undefined ? <option value=''>{placeholder}</option> : null}
                {options.map((option) => {
                    const { value, label: optionLabel } =
                        typeof option === 'string'
                            ? { value: option, label: option }
                            : option;

                    return <option value={value} key={value}>{optionLabel}</option>
                })}
            </select>
        </FormField>
    )
}

export default SelectField
