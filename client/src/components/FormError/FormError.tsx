import type { ReactNode } from 'react';
import errorIcon from '../../assets/images/error-12px.svg';

type FormErrorProps = {
    id?: string;
    children: ReactNode;
};

function FormError({ id, children }: FormErrorProps) {
    return (
        <p className='error-text' id={id} role='alert'>
            <img src={errorIcon} alt='' /> {children}
        </p>
    )
}

export default FormError
