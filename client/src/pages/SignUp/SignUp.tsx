import FormError from '../../components/FormError';
import TextField from '../../components/TextField';
import { useRegisterMutation } from '../../hooks/mutations/useRegisterMutation';
import { FormProvider, useForm } from 'react-hook-form';

type SignUpFormValues = {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
};

function SignUp({setShowRegister, setShowLogin}: any) {

    const registerMutation = useRegisterMutation();
    const methods = useForm<SignUpFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
    });
    const { handleSubmit } = methods;

    const handleSignUp = ({ confirmPassword: _confirmPassword, ...newUser }: SignUpFormValues) => {
        registerMutation.mutate(newUser, {
        onSuccess: () => {
            alert('Registered Successfully')
            setShowRegister(false);
            setShowLogin(true);
        },
        })
    }

    return (
        <div className='overlay'>
            <div className='login-container'>
                <FormProvider {...methods}>
                    <form className='form' onSubmit={handleSubmit(handleSignUp)}>
                        <h2 className='form__header'>Sign Up</h2>
                        <TextField
                            name='name'
                            label='Name:'
                            placeholder='Enter your full name'
                            rules={{ required: 'You must enter your name' }}
                        />
                        <TextField
                            name='username'
                            label='Username:'
                            placeholder='Username'
                            rules={{ required: 'You must enter a username' }}
                        />
                        <TextField
                            name='password'
                            label='Password:'
                            placeholder='Password'
                            type='password'
                            rules={{
                                required: 'You must enter a password',
                                deps: 'confirmPassword',
                            }}
                        />
                        <TextField
                            name='confirmPassword'
                            label='Confirm password:'
                            placeholder='Confirm Password'
                            type='password'
                            rules={{
                                required: 'You must confirm your password',
                                validate: (value, formValues) =>
                                    value === formValues.password || "Passwords don't match",
                            }}
                        />
                        {registerMutation.isError ? <FormError>Unable to register. Please try again.</FormError> : ''}
                        <div className='form__button-container'>
                            <button className='button--back' type='button' onClick={()=>setShowRegister(false)}>Cancel</button>
                            <button className='button' type='submit' disabled={registerMutation.isPending}>Sign Up</button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}

export default SignUp
