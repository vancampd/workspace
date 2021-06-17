import {Component} from 'react';
import './Header.scss';
import {NavLink} from 'react-router-dom';
import Logo from '../Logo';

class Header extends Component {
    render(){
        return(
            <header className='header'>
                <div className='header__wrapper'>
                    <Logo/>
                    <nav className='header__nav'>
                        <ul className='header__nav-list'>
                            {/* <li className='header__list-item'><NavLink strict to='/home' className='header__link' activeClassName='header__link--active'>Home</NavLink></li> */}
                            <li className='header__list-item'><NavLink strict to='/favorites' className='header__link' activeClassName='header__link--active'>Favorites</NavLink></li>
                            <li className='header__list-item'><NavLink to='/post' className='header__link' activeClassName='header__link--active'>Post Your Space</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </header>
        )
    }
}

export default Header;