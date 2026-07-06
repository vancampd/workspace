import './Header.scss';
import {NavLink} from 'react-router-dom';
import Logo from '../Logo';
import Login from '../../pages/Login';
import SignUp from '../../pages/SignUp';

function Header({showLogin, setShowLogin, showRegister, setShowRegister, signedIn, setSignedIn, setCredentials}: any) {
    
    return(
        <header className='header'>
            <div className='header__wrapper'>
                <Logo/>
                <nav className='header__nav'>
                    <ul className='header__nav-list'>
                        {
                            !signedIn ?
                                <li className='header__list-item' onClick={()=>setShowLogin(true)}>Sign In</li>
                            : <>
                                <li className='header__list-item'><NavLink to='/favorites' className={({ isActive }) => isActive ? 'header__link header__link--active' : 'header__link'}>Favorites</NavLink></li>
                                <li className='header__list-item'><NavLink to='/post' className={({ isActive }) => isActive ? 'header__link header__link--active' : 'header__link'}>Post Your Space</NavLink></li>
                                <li className='header__list-item--logout' onClick={()=>{localStorage.clear(); setSignedIn(false)}}>Logout</li>
                            </>
                        }
                        
                    </ul>
                </nav>
            </div>
            {
                showLogin ?
                <Login showRegister={showRegister} setShowRegister={setShowRegister} setShowLogin={setShowLogin} setSignedIn={setSignedIn} setCredentials={setCredentials}/>
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
