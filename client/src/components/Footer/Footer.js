import {Component} from 'react';
import './Footer.scss';
import Logo from '../Logo';

class Footer extends Component {
    render(){
        return(
            <footer className="footer">
                <Logo/>
            </footer>           
        )
    }
}

export default Footer;