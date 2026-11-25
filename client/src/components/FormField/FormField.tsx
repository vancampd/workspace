import type { ReactNode } from 'react';
import FormError from '../FormError';

type FormFieldProps = {
    label: ReactNode;
    htmlFor?: string;
    error?: string;
    errorId?: string;
    className?: string;
    children: ReactNode;
};

function FormField({
    label,
    htmlFor,
    error,
    errorId,
    className = 'form__element-container',
    children,
}: FormFieldProps) {
    return (
        <div className={className}>
            <label className='form__label' htmlFor={htmlFor}>{label}</label>
            {children}
            {error ? <FormError id={errorId}>{error}</FormError> : ''}
        </div>
    )
}

export default FormField
