import {useState} from 'react'
import './Login.scss';
import errorIcon from '../../assets/images/error-12px.svg';
import jwt_decode from 'jwt-decode';
import { useLoginMutation } from '../../hooks/mutations/useLoginMutation';

function Login({setShowRegister, setShowLogin, setSignedIn, setCredentials}: any) {

    const [input, setInput] = useState<any>({})

    const [error, setError] = useState(false)
    const loginMutation = useLoginMutation()

    const handleInputChange = (e) => {

        const {name, value} = e.target;

        setInput({...input, [name]: value})
    }

    const handleLogin = (e) => {
        e.preventDefault();

        const {username, password} = input;

        if(!username || !password) return setError(true)

        loginMutation.mutate(input, {
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
            const decoded = jwt_decode<{name: string}>(data.token)
            localStorage.setItem('name', decoded.name)
            setError(false)
            setShowLogin(false)
            setSignedIn(true)
            setCredentials({name: decoded.name})
        },
        onError: (err) => {
            console.log('Error logging in', err)
            setError(true)
        }
        })
    }

    return (
        <div className='overlay'>
            <div className='login-container'>
                <form className='form' onSubmit={handleLogin}>
                    <h2 className='form__header'>Login</h2>
                    <div className='form__element-container'>
                        <label className='form__label' htmlFor='username'>Username:</label>
                        <input 
                            className='form__input' 
                            name='username' 
                            id='username' 
                            placeholder="Username"
                            onChange={handleInputChange}
                        />
                        {
                            error && !input.username ? 
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>You must enter a location</p> 
                            : ''
                        }

                    </div>
                    <div className='form__element-container'>
                        <label className='form__label' htmlFor='password'>Password:</label>
                        <input 
                            className='form__input' 
                            name='password' 
                            id='password' 
                            placeholder="Password"
                            type='password'
                            onChange={handleInputChange}
                        />
                        {
                            error && !input.password ? 
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>You must enter a password</p> 
                            : ''
                        }

                    </div>
                    
                    <div className='form__button-container'>
                        <button className='button--back' type='button' onClick={()=>setShowLogin(false)}>Cancel</button> 
                        <button className='button' type='submit'>Login</button>
                    </div>
                    {
                        error && input.password && input.username ?
                        <p className='error-text'><img src={errorIcon} alt='error icon'/>Invalid login credentials</p> 
                        : ''
                    }
                    <p className='form__label'>If you do not have a username, please register <span className='emphasize' onClick={()=>{setShowLogin(false); setShowRegister(true)}}>here</span></p>
                </form>
            </div>
        </div>
    )
}

export default Login
