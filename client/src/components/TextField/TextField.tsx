import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import {
    get,
    useFormContext,
    type FieldError,
    type RegisterOptions,
} from 'react-hook-form';
import FormField from '../FormField';

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> & {
    name: string;
    label: ReactNode;
    rules?: RegisterOptions<any, any>;
    as?: 'input' | 'textarea';
    id?: string;
    className?: string;
    // Limits which errors this field displays (e.g. only format errors).
    shouldShowError?: (error: FieldError) => boolean;
};

function TextField({
    name,
    label,
    rules,
    as = 'input',
    id = name,
    className,
    shouldShowError,
    ...inputProps
}: TextFieldProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const fieldError = get(errors, name) as FieldError | undefined;
    const error =
        fieldError && (!shouldShowError || shouldShowError(fieldError))
            ? fieldError.message
            : undefined;
    const errorId = `${id}-error`;
    const controlProps = {
        className: 'form__input',
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
        ...inputProps,
        ...register(name, rules),
    };

    return (
        <FormField
            label={label}
            htmlFor={id}
            error={error}
            errorId={errorId}
            className={className}
        >
            {as === 'textarea' ? <textarea {...(controlProps as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)} /> : <input {...controlProps} />}
        </FormField>
    )
}

export default TextField
