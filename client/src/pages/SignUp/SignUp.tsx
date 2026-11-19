import errorIcon from '../../assets/images/error-12px.svg';
import { useRegisterMutation } from '../../hooks/mutations/useRegisterMutation';
import { useForm } from 'react-hook-form';

type SignUpFormValues = {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
};

function SignUp({setShowRegister, setShowLogin}: any) {

    const registerMutation = useRegisterMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
    });

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
                <form className='form' onSubmit={handleSubmit(handleSignUp)}>
                    <h2 className='form__header'>Sign Up</h2>
                    <div className='form__element-container'>
                        <label className='form__label' htmlFor='name'>Name:</label>
                        <input
                            className='form__input'
                            id='name'
                            placeholder="Enter your full name"
                            {...register('name', {
                                required: 'You must enter your name',
                            })}
                        />
                        {
                            errors.name ?
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>{errors.name.message}</p>
                            : ''
                        }
                    </div>
                    <div className='form__element-container'>
                        <label className='form__label' htmlFor='username'>Username:</label>
                        <input
                            className='form__input'
                            id='username'
                            placeholder="Username"
                            {...register('username', {
                                required: 'You must enter a username',
                            })}
                        />
                        {
                            errors.username ?
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>{errors.username.message}</p>
                            : ''
                        }
                    </div>
                    <div className='form__element-container'>
                        <label className='form__label' htmlFor='password'>Password:</label>
                        <input
                            className='form__input'
                            id='password'
                            placeholder="Password"
                            type='password'
                            {...register('password', {
                                required: 'You must enter a password',
                                deps: 'confirmPassword',
                            })}
                        />
                        {
                            errors.password ?
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>{errors.password.message}</p>
                            : ''
                        }
                    </div>
                    <div className='form__element-container'>
                        <label className='form__label' htmlFor='confirmPassword'>Confirm password:</label>
                        <input
                            className='form__input'
                            id='confirmPassword'
                            placeholder="Confirm Password"
                            type='password'
                            {...register('confirmPassword', {
                                required: 'You must confirm your password',
                                validate: (value, formValues) =>
                                    value === formValues.password || "Passwords don't match",
                            })}
                        />
                        {
                            errors.confirmPassword ?
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>{errors.confirmPassword.message}</p>
                            : ''
                        }
                        {
                            registerMutation.isError ?
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>Unable to register. Please try again.</p>
                            : ''
                        }
                    </div>
                    <div className='form__button-container'>
                        <button className='button--back' type='button' onClick={()=>setShowRegister(false)}>Cancel</button>
                        <button className='button' type='submit' disabled={registerMutation.isPending}>Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp
