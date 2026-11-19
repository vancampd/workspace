import './Login.scss';
import errorIcon from '../../assets/images/error-12px.svg';
import jwt_decode from 'jwt-decode';
import { useLoginMutation } from '../../hooks/mutations/useLoginMutation';
import { useForm } from 'react-hook-form';

type LoginFormValues = {
    username: string;
    password: string;
};

function Login({setShowRegister, setShowLogin, setSignedIn, setCredentials}: any) {

    const loginMutation = useLoginMutation()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const loginErrorStatus = (loginMutation.error as { response?: { status?: number } } | null)
        ?.response?.status
    // The API responds 400 for an unknown user or wrong password
    const isInvalidCredentials = loginErrorStatus === 400 || loginErrorStatus === 401
    const loginErrorMessage = isInvalidCredentials
        ? 'Invalid login credentials'
        : 'Unable to log in. Please try again.'

    const handleLogin = (input: LoginFormValues) => {
        loginMutation.mutate(input, {
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
            const decoded = jwt_decode<{name: string}>(data.token)
            localStorage.setItem('name', decoded.name)
            setShowLogin(false)
            setSignedIn(true)
            setCredentials({name: decoded.name})
        },
        })
    }

    return (
        <div className='overlay'>
            <div className='login-container'>
                <form className='form' onSubmit={handleSubmit(handleLogin)}>
                    <h2 className='form__header'>Login</h2>
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
                            })}
                        />
                        {
                            errors.password ?
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>{errors.password.message}</p>
                            : ''
                        }

                    </div>

                    <div className='form__button-container'>
                        <button className='button--back' type='button' onClick={()=>setShowLogin(false)}>Cancel</button>
                        <button className='button' type='submit' disabled={loginMutation.isPending}>Login</button>
                    </div>
                    {
                        loginMutation.isError ?
                        <p className='error-text'><img src={errorIcon} alt='error icon'/>{loginErrorMessage}</p>
                        : ''
                    }
                    <p className='form__label'>If you do not have a username, please register <span className='emphasize' onClick={()=>{setShowLogin(false); setShowRegister(true)}}>here</span></p>
                </form>
            </div>
        </div>
    )
}

export default Login
