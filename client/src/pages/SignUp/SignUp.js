import {useState, useEffect} from 'react'
import './SignUp.scss';
import {useHistory} from 'react-router-dom'
import axios from 'axios';
import errorIcon from '../../assets/images/error-12px.svg';
const API_URL = process.env.REACT_APP_EXPRESS_API_URL;

function SignUp({showRegister, setShowRegister, setShowLogin}) {

    const history = useHistory();

    const [input, setInput] = useState({});

    const [error, setError] = useState(false);

    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleInputChange = (e) => {

        const {name, value} = e.target;

        setInput({...input, [name]: value});
    }

    useEffect(()=>{
        if(input.password !== input.confirmPassword){
                return setPasswordMatch(false)
        } else {
            setPasswordMatch(true)
        }
    },[input.password, input.confirmPassword])

    

    const handleSignUp = (e) => {
        e.preventDefault();

        const {name, username, password, confirmPassword} = input;

        if(!name || !username || !password || !confirmPassword){
            return setError(true) 
        }

        axios
        .post(`${API_URL}users/register`, input)
        .then(res => {
            alert('Registered Successfully')
            history.push('/login')
        })
        .catch(err => console.log('Error signing up', err))
    }

    return (
        <div className='overlay'>
            <div className='login-container'>
                <form className='form' onSubmit={handleSignUp}>
                    <h2 className='form__header'>Sign Up</h2>
                    <div className='form__element-container'>
                        <label className='form__label' htmlFor='name'>Name:</label>
                        <input 
                            className='form__input' 
                            name='name' 
                            id='name' 
                            placeholder="Enter your full name"
                            onChange={handleInputChange}
                        />
                        {
                            error && !input.username ? 
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>You must enter a username</p> 
                            : ''
                        }
                    </div>
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
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>You must enter a username</p> 
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
                    <div className='form__element-container'>
                        <label className='form__label' htmlFor='password'>Confirm password:</label>
                        <input 
                            className='form__input' 
                            name='confirmPassword' 
                            id='confirmPassword' 
                            placeholder="Confirm Password"
                            type='password'
                            onChange={handleInputChange}
                        />
                        {
                            error && !input.confirmPassword ? 
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>You must enter a password</p> 
                            : ''
                        }
                        {
                            !passwordMatch ? 
                            <p className='error-text'><img src={errorIcon} alt='error icon'/>Passwords don't match</p> 
                            : ''
                        }
                    </div>
                    <div className='form__button-container'>
                        <button className='button--back' type='button' onClick={()=>setShowRegister(false)}>Cancel</button> 
                        <button className='button' type='submit'>Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp
