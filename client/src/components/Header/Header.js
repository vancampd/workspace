import './Header.scss';
import {NavLink} from 'react-router-dom';
import Logo from '../Logo';
// import {useEffect, useState} from 'react';
import Login from '../../pages/Login';
import SignUp from '../../pages/SignUp';

function Header({showLogin, setShowLogin, showRegister, setShowRegister, signedIn, setSignedIn}) {

    
    // const {pathname}=useLocation()

    // const [token, setToken] = useState('')
    // const [signedIn, setSignedIn] = useState(false)

    // useEffect(()=>{
    //     const token = sessionStorage.getItem('token');
       
    //     if(token){
    //         setSignedIn(true)
    //     }
    // }, [pathname])
    
    return(
        <header className='header'>
            <div className='header__wrapper'>
                <Logo/>
                <nav className='header__nav'>
                    <ul className='header__nav-list'>
                        {
                            !signedIn ?
                                // <li className='header__list-item'><NavLink to='/login' className='header__link' activeClassName='header__link--active'>Sign In</NavLink></li>
                                <li className='header__list-item' onClick={()=>setShowLogin(true)}>Sign In</li>
                            : <>
                                <li className='header__list-item'><NavLink strict to='/favorites' className='header__link' activeClassName='header__link--active'>Favorites</NavLink></li>
                                <li className='header__list-item'><NavLink to='/post' className='header__link' activeClassName='header__link--active'>Post Your Space</NavLink></li>
                                <li className='header__list-item--logout' onClick={()=>{sessionStorage.clear(); setSignedIn(false)}}>Logout</li>
                            </>
                        }
                        
                    </ul>
                </nav>
            </div>
            {
                showLogin ?
                <Login showRegister={showRegister} setShowRegister={setShowRegister} setShowLogin={setShowLogin} setSignedIn={setSignedIn}/>
                : ''
            }
            {
                showRegister ?
                <SignUp showRegister={showRegister} setShowRegister={setShowRegister} setShowLogin={setShowLogin}/>
                : ''
            }
        </header>
    )
    
}

export default Header;