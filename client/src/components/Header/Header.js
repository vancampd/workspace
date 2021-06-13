import {Component} from 'react';
import './Header.scss';
import {NavLink} from 'react-router-dom';

class Header extends Component {
    render(){
        return(
            <header className='header'>
                <div className='header__wrapper'>
                    <h1 className="logo">W<span className='logo--underline'>or</span>kspace</h1>
                    <nav className='header__nav'>
                        <ul className='header__nav-list'>
                            <li className='header__list-item'><NavLink to='/' className='header__link' activeClassName='header__link--active'>Home</NavLink></li>
                            <li className='header__list-item'><NavLink to='/post' className='header__link' activeClassName='header__link--active'>Post Your Space</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </header>
        )
    }
}

export default Header;