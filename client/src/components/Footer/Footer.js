import {Component} from 'react';
import './Footer.scss';
import Logo from '../Logo';

class Footer extends Component {
    render(){
        return(
            <footer className="footer">
                <Logo/>
                <div className='footer__info-container'>
                    <h3 className='footer__header'>About us</h3>
                    <p className='footer__text'>
                        We know businesses have been greatly affected over the past year. 
                        One change is more employees working remotely. As a result, many businesses have space that isn't being used effectively. 
                        We want to help increase the occupancy rate of your space, and highlight the 'OR' in our name because of that.
                        If you have space not being used, post it with us and let us help find you the right partner to rent your space.
                    </p>
                </div>
                <div className='footer__info-container'>
                    <h3 className='footer__header'>Developed by Danny Van Camp</h3>
                    <a className='footer__text' href='http://github.com/vancampd'>
                        http://github.com/vancampd
                    </a>
                </div>
            </footer>           
        )
    }
}

export default Footer;