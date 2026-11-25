import './Login.scss';
import FormError from '../../components/FormError';
import TextField from '../../components/TextField';
import jwt_decode from 'jwt-decode';
import { useLoginMutation } from '../../hooks/mutations/useLoginMutation';
import { FormProvider, useForm } from 'react-hook-form';

type LoginFormValues = {
    username: string;
    password: string;
};

function Login({setShowRegister, setShowLogin, setSignedIn, setCredentials}: any) {

    const loginMutation = useLoginMutation()
    const methods = useForm<LoginFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            username: '',
            password: '',
        },
    })
    const { handleSubmit } = methods

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
                <FormProvider {...methods}>
                    <form className='form' onSubmit={handleSubmit(handleLogin)}>
                        <h2 className='form__header'>Login</h2>
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
                            rules={{ required: 'You must enter a password' }}
                        />

                        <div className='form__button-container'>
                            <button className='button--back' type='button' onClick={()=>setShowLogin(false)}>Cancel</button>
                            <button className='button' type='submit' disabled={loginMutation.isPending}>Login</button>
                        </div>
                        {loginMutation.isError ? <FormError>{loginErrorMessage}</FormError> : ''}
                        <p className='form__label'>If you do not have a username, please register <span className='emphasize' onClick={()=>{setShowLogin(false); setShowRegister(true)}}>here</span></p>
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}

export default Login
