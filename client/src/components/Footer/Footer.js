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
                        One of those is more employees working remotely. As a result, many businesses have space that isn't being used effectively. 
                        We want to help increase the occupancy rate of your space, and highlight the 'OR' in our name because of that.
                        If you have space not being used, post it with us and let us help find you the right partner to rent the space, for any amount of time!
                    </p>
                </div>
            </footer>           
        )
    }
}

export default Footer;